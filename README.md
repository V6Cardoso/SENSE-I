# Projeto SENSE-I

Este é o repositório para o projeto SENSE-I.

Este projeto tem como objetivo desenvolver uma prova de conceito para um dispositivo de monitoramento de variaveis coletadas por um hardware que está ligado a uma interface IoT que possui um uma aplicação móvel e web e para a exibição e operação com esses dados.

## Executando com Docker

Siga as etapas abaixo para executar o projeto com Docker:

1. Clone o repositório:
    ```
    git clone --depth=1 https://github.com/V6Cardoso/SENSE-I.git
    ```
2. Navegue até o diretório `web`:
    ```
    cd web
    ```
3. Abra o `Dockerfile.dockerfile` e substitua "YOUR_FIWARE_IP_ADDRESS" pelo endereço IP da sua instância FIWARE.
4. Construa a imagem Docker:
    ```
    docker image build -t dmie -f Dockerfile.dockerfile .
    ```
5. Execute a imagem Docker:
    ```
    docker run -p 80:5000 -d dmie
    ```

## Hardware

Para o hardware foram utilizados:
1 - Microcontrolador ESP-32
1 - Sensor de temperatura e umidade DHT-22
1 - Fonte de alimentação de 15 watts

Para a conexão do sensor com o microcontrolador foi utilizado um cabo com 3 fios e para a alimentação do microcontrolador com a fonte foi utilizado o cabo micro-USB.

- Além disso, foram desenvolvidas cases para armazenar o microcontrolador e o sensor. O arquivo 3D do projeto, utilizado para a impressão das cases, encontra-se anexado na pasta denominada 'hardware'.

Para efetuar a programação do microcontrolador siga os seguintes passos:

1. Abra a IDE de sua preferência, recomendamos a Arduino IDE.

2. Na aba 'Ferramentas', procure pela opção 'Portas', e então selecione o 'Gerenciador de portas' procure e instale pelo pacote 'esp32'.

3. Na aba 'Gerenciador de biblioteca', instale a biblioteca 'DHT Sensor library PubSubClient'.

4. Conecte o seu microcontrolador na porta USB do computador e identifique essa na IDE.

5. Na barra de superior clique em 'Arquivos' e em 'Abrir', então procure o arquivo 'SENSEI-hardware' na pasta 'hardware' do repositório.

4. Compile o projeto para o seu microcontrolador.

## Executando Localmente

Siga as etapas abaixo para executar o projeto localmente:

1. Navegue até o diretório `web`:
    ```
    cd web
    ```
2. Crie um ambiente virtual:
    ```
    python -m venv env
    ```
3. Ative o ambiente virtual:
    ```
    env/Scripts/Activate
    ```
4. Instale os pacotes necessários:
    ```
    pip install -r requirements.txt
    ```
5. Crie um arquivo `.env` dentro do diretório `dmie` e adicione as seguintes variáveis de ambiente:
    ```
    IP=http://"YOUR_FIWARE_IP_ADDRESS"
    ```
6. Execute o aplicativo Flask:
    ```
    flask --app dmie run --debug
    ```


## Executando o aplicativo mobile

Siga as etapas abaixo para executar o aplicativo mobile:

1. Navegue até o diretório `mobile`:
    ```
    cd mobile
    ```
2. Instale as dependências:
    ```
    npm install
    ```
3. Abra o arquivo `App.js` e substitua "YOUR_FIWARE_IP_ADDRESS" pelo endereço IP da sua instância FIWARE.
4. Execute o aplicativo:
    ```
    npx expo start
    ```
5. Cheque no terminal se o servidor está no modo Expo Go ou Development build. Se estiver no modo Development build, pressione `s` para alternar para o modo Expo Go.
6. Abra o aplicativo Expo Go no seu dispositivo móvel e escaneie o QR Code.

### Observações

- O aplicativo mobile foi desenvolvido e testado apenas no sistema operacional Android.
- Para reproduzir as notificações push no Android, é necessário configurar o Firebase Cloud Messaging (FCM) e adicionar o arquivo `google-services.json` na raiz do diretório `mobile`. Para mais informações, consulte a [documentação do Expo sobre FCM](https://docs.expo.dev/push-notifications/fcm-credentials/).

