import axios from 'axios';
import https from 'https';
const agent = new https.Agent({
    rejectUnauthorized: false
  });

class DeployPortainer {
    constructor() {
        this.portainerUrl = "https://167.114.128.102:9443/api";
        this.dockerAuth = process.env.DOCKER_AUTH;
        this.token = "";
        this.Username = process.env.USERNAME
        this.Password = process.env.PASSWORD
        this.Imagem = "funil_vendas_frontend:latest"
        this.idContainer = "000";

        this.executaGitOps();
    }

    executaGitOps = async () => {
        await this.portainerLogin();
        await this.pararContainerPorImagem();
        await this.deletarContainerParados();
        await this.pullarImagemDockerHub();
        await this.criarContainer();
        await this.rodarContainer();
        this.deletarImagensParadas();

    }

    deletarImagensParadas = async () => {
        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: this.portainerUrl + '/endpoints/2/docker/images/prune',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${this.token}`,
            },
            httpsAgent: agent
        }
        try {
            const response = await axios(config);
            console.log("Deletou images parados com sucesso")
        } catch(err) {
            throw new Error("Erro ao deletar os images parados")
        }
    }


    portainerLogin = async () => {
        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: this.portainerUrl + '/auth',
            headers: {
                'Content-Type': 'application/json', 
            },
            data: {
                Username: this.Username,
                Password: this.Password
            },
            httpsAgent: agent
        }
        try {
            console.log(config);
            const response = await axios(config);
            const token = response.data.jwt;
            this.token = token;  
            console.log("Fez login no portainer com sucesso!")
  
        } catch(err) {
            console.log(err);
            throw new Error("Erro ao logar no Portainer")
        }
    }

    pullarImagemDockerHub = async () => {
        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: this.portainerUrl + '/endpoints/2/docker/images/create?fromImage=copapel/'+ this.Imagem +'',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${this.token}`,
                'X-Registry-Auth': this.dockerAuth
            },
            httpsAgent: agent
        }
        try {
            const response = await axios(config);
            console.log("Puxou a imagem do dockerhub com sucesso!")
        } catch(err) {
            throw new Error("Erro ao puxar a imagem do Docker Hub")
        }
    }
    

    pararContainerPorImagem = async () => {
        try {
            const listContainersConfig = {
                method: "get",
                url: this.portainerUrl + '/endpoints/2/docker/containers/json?all=true',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                },
                httpsAgent: agent
            };
            const response = await axios(listContainersConfig);
            const containers = response.data;
            
            const targetContainer = containers.find(container => container.Image === "copapel/" + this.Imagem);
    
            if (targetContainer) {
                const stopContainerConfig = {
                    method: "post",
                    url: this.portainerUrl + `/endpoints/2/docker/containers/${targetContainer.Id}/stop`,
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                    },
                    httpsAgent: agent
                };
                await axios(stopContainerConfig);
                console.log(`Container ${targetContainer.Id} parado com sucesso.`);
            } else {
                console.log("Nenhum container rodando com a imagem especificada.");
            }
        } catch (error) {
            console.error("Erro ao parar o container:", error);
        }
    }
    deletarContainerParados = async () => {

        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: this.portainerUrl + '/endpoints/2/docker/containers/prune',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${this.token}`,
            },
            httpsAgent: agent
        }
        try {
            const response = await axios(config);
            console.log("Deletou containers parados com sucesso")
        } catch(err) {
            throw new Error("Erro ao deletar os containers parados")
        }
    }

    criarContainer = async () => {
        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: this.portainerUrl + '/endpoints/2/docker/containers/create',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${this.token}`,
            },
            data: {
                "name": "funil_vendas_frontend",
                "Image": "copapel/funil_vendas_frontend:latest",
                "ExposedPorts": { "80/tcp": {} },
                "HostConfig": { "PortBindings": { "8007/tcp": [{ "HostPort": "8007" }] }}
            },
            httpsAgent: agent
        }
        try {
            const response = await axios(config);
            this.idContainer = response.data.Id;
            console.log("Criou o container com sucesso!")

        } catch(err) {
            throw new Error("Erro ao criar o container")
        }
    }


    rodarContainer = async () => {
        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: this.portainerUrl + `/endpoints/2/docker/containers/${this.idContainer}/start`,
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${this.token}`,
            },
            httpsAgent: agent
        }

        try {
            const response = await axios(config);
            console.log("Rodou o container com sucesso!");
        } catch(err) {
            throw new Error("Erro ao rodar o container");
        }
    }
}

const deploy = new DeployPortainer();
