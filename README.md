# Projeto SENSE-I

Este é o repositório para o projeto SENSE-I.

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
    docker run -p 5000:5000 -d dmie
    ```

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
    IP=YOUR_FIWARE_IP_ADDRESS
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

