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
5. Abra o `Dockerfile.dockerfile` e substitua "YOUR_FIWARE_IP_ADDRESS" pelo endereço IP da sua instância FIWARE.
6. Execute o aplicativo Flask:
    ```
    flask --app dmie run --debug
    ```