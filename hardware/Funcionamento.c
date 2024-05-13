#include "esp_wpa2.h"
#include <WiFi.h>
#include <DHT.h>
#include <Wire.h>
#include <PubSubClient.h>  // Importa a Biblioteca PubSubClient

#define TOPICO_SUBSCRIBE "/TEF/"NOME DO DISPOSITIVO"/cmd"
#define TOPICO_PUBLISH "/TEF/"NOME DO DISPOSITIVO"/attrs"
#define TOPICO_PUBLISH_2 "/TEF/"NOME DO DISPOSITIVO"/attrs/h"
#define TOPICO_PUBLISH_3 "/TEF/"NOME DO DISPOSITIVO"/attrs/t"

#define ID_MQTT "NOME DO DISPOSITIVO"

#define DHTPIN 2 //Pinagem no ESP32
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

// WI-FI{
  const char* ssid = "REDE";
  const char* PASSWORD = "SENHA";
//}

// MQTT
const char* BROKER_MQTT = "";  //URL do broker MQTT que se deseja utilizar
int BROKER_PORT = 1883;                     // Porta do Broker MQTT

int D4 = 2;

//Variáveis e objetos globais
WiFiClient espClient;          // Cria o objeto espClient
PubSubClient MQTT(espClient);  // Instancia o Cliente MQTT passando o objeto espClient
char EstadoSaida = '0';        //variável que armazena o estado atual da saída
hw_timer_t *timer = NULL;  //faz o controle do temporizador (interrupção por tempo)

//Prototypes
void initSerial();
void initWiFi();
void initMQTT();
void reconectWiFi();
void mqtt_callback(char* topic, byte* payload, unsigned int length);
void VerificaConexoesWiFIEMQTT(void);
void InitOutput(void);

void setup() {
  //inicializações:
  configureWatchdog();
  InitOutput();
  initSerial();
  initWiFi();
  initMQTT();
  delay(5000);
  MQTT.publish(TOPICO_PUBLISH, "s|on");
}

//programa principal
void loop() {
  int i = 0;
  const int potPin = 2;
  float somadorTemperatura = 0;
  float totalTemperatura = 0;
  float somadorHumidity = 0;
  float totalHumidity = 0;
  char msgHumidity[10];
  char msgTemperature[10];

  do {// Pode ser alterado para realizar uma média dos valores lidos
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();

    somadorTemperatura = somadorTemperatura + temperature;
    somadorHumidity = somadorHumidity + humidity;
    i++;

    delay(1000);
  } while (i < 1);

  totalHumidity = somadorHumidity / 1;
  totalTemperatura = somadorTemperatura / 1;

  //garante funcionamento das conexões WiFi e ao broker MQTT
  if (!MQTT.connect(ID_MQTT))
    VerificaConexoesWiFIEMQTT();

  //envia o status de todos os outputs para o Broker no protocolo esperado
  EnviaEstadoOutputMQTT();

  itoa(somadorHumidity, msgHumidity, 10);
  Serial.println(msgHumidity);
  dtostrf(somadorTemperatura, 4, 1, msgTemperature);
  Serial.println(msgTemperature);
  MQTT.publish(TOPICO_PUBLISH_2, msgHumidity);
  MQTT.publish(TOPICO_PUBLISH_3, msgTemperature);
  timerWrite(timer, 0);
  MQTT.loop();

   delay(60000);
}

//função que o temporizador irá chamar, para reiniciar o ESP32
void IRAM_ATTR resetModule(){
  ets_printf("(watchdog) reiniciar\n"); //imprime no log
  esp_restart(); //reinicia o chip
}

//função que o configura o temporizador
void configureWatchdog()
{
  timer = timerBegin(0, 80, true); //timerID 0, div 80
  //timer, callback, interrupção de borda
  timerAttachInterrupt(timer, &resetModule, true);
  // instancia de timer, tempo (us),3.000.000 us = 3 segundos , repetição
  timerAlarmWrite(timer, 180000000, true);
  timerAlarmEnable(timer); //habilita a interrupção //enable interrupt
}

//Função: inicializa comunicação serial com baudrate 115200 (para fins de monitorar no terminal serial o que está acontecendo).
void initSerial() {
  Serial.begin(115200);
  Wire.begin();
  dht.begin();
}

//Função: inicializa e conecta-se na rede WI-FI desejada.
void initWiFi() {
  delay(10);
  Serial.println("------Conexao WI-FI------");
  Serial.print("Conectando-se na rede: ");
  Serial.println(ssid);
  Serial.println("Aguarde");

  reconectWiFi();
}

//Função: inicializa parâmetros de conexão MQTT(endereço do broker, porta e seta função de callback)
void initMQTT() {
  MQTT.setServer(BROKER_MQTT, BROKER_PORT);  //informa qual broker e porta deve ser conectado
  MQTT.setCallback(mqtt_callback);           //atribui função de callback (função chamada quando qualquer informação de um dos tópicos subescritos chega)
}

//Função: função de callback esta função é chamada toda vez que uma informação de um dos tópicos subescritos chega)
void mqtt_callback(char* topic, byte* payload, unsigned int length) {
  String msg;

  //obtem a string do payload recebido
  for (int i = 0; i < length; i++) {
    char c = (char)payload[i];
    msg += c;
  }

  Serial.print("- Mensagem recebida: ");
  Serial.println(msg);

  //toma ação dependendo da string recebida:
  //verifica se deve colocar nivel alto de tensão na saída D0:
  //IMPORTANTE: o Led já contido na placa é acionado com lógica invertida (ou seja,
  //enviar HIGH para o output faz o Led apagar / enviar LOW faz o Led acender)
  if (msg.equals("lamp001@on|")) {
    digitalWrite(D4, HIGH);
    EstadoSaida = '1';
  }

  //verifica se deve colocar nivel alto de tensão na saída D0:
  if (msg.equals("lamp001@off|")) {
    digitalWrite(D4, LOW);
    EstadoSaida = '0';
  }
}

//Função: reconecta-se ao broker MQTT (caso ainda não esteja conectado ou em caso de a conexão cair)em caso de sucesso na conexão ou reconexão, o subscribe dos tópicos é refeito.
void reconnectMQTT() {
  while (!MQTT.connected()) {
    if (WiFi.status() != WL_CONNECTED) {
      reconectWiFi();
    }

    Serial.print("* Tentando se conectar ao Broker MQTT: ");
    Serial.println(BROKER_MQTT);
    if (MQTT.connect(ID_MQTT)) {
      Serial.println("Conectado com sucesso ao broker MQTT!");
      MQTT.subscribe(TOPICO_SUBSCRIBE);
    } else {
      Serial.println("Falha ao reconectar no broker.");
      Serial.println("Havera nova tentatica de conexao em 2s");
      delay(2000);
    }
  }
}

//Função: reconecta-se ao WiFi
void reconectWiFi() {
  if (WiFi.status() == WL_CONNECTED)
    return;

  WiFi.begin(ssid, PASSWORD); // Conecta na rede WI-FI

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(100);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("Conectado com sucesso na rede ");
  Serial.print(ssid);
  Serial.println(" IP obtido: ");
  Serial.println(WiFi.localIP());
}

//Função: verifica o estado das conexões WiFI e ao broker MQTT. Em caso de desconexão (qualquer uma das duas), a conexão é refeita.
void VerificaConexoesWiFIEMQTT(void) {
  reconectWiFi();  //se não há conexão com o WiFI, a conexão é refeita

  if (!MQTT.connected())
    reconnectMQTT();  //se não há conexão com o Broker, a conexão é refeita
}

//Função: envia ao Broker o estado atual do output.
void EnviaEstadoOutputMQTT(void) {
  if (EstadoSaida == '1') {
    MQTT.publish(TOPICO_PUBLISH, "s|on");
    Serial.println("- Led Ligado");
  }
  if (EstadoSaida == '0') {
    MQTT.publish(TOPICO_PUBLISH, "s|off");
    Serial.println("- Led Desligado");
  }
  Serial.println("- Estado do LED onboard enviado ao broker!");
  delay(1000);
}

//Função: inicializa o output em nível lógico baixo.
void InitOutput(void) {
  //IMPORTANTE: o Led já contido na placa é acionado com lógica invertida (ou seja,
  //enviar HIGH para o output faz o Led apagar / enviar LOW faz o Led acender)
  pinMode(D4, OUTPUT);
  digitalWrite(D4, HIGH);

  boolean toggle = false;

  for (int i = 0; i <= 10; i++) {
    toggle = !toggle;
    digitalWrite(D4, toggle);
    delay(200);
  }
}
