# Código 3 - Projeto de Finalização de curso

### Priorização no deslocamento de veículos de emergência utilizando a infraestrutura conectada de grandes centros urbanos

Este projeto explora de como se pode utilizar artifícios de integração a infraestrutura de grandes centros urbanos para dar suporte ao atendimento de veículos de emergência utilizando metodologias como traffic preemption de base, e assim trazendo mais segurança aos ocupantes e agilidade no atendimento de emergências, no mesmo será discutido a arquitetura do sistema e os resultados alcançados.


## Aplicativo de navegação

O Aplicativo foi desenvolvido de forma que ele seja a interface entre o usuário final e os serviços de suporte ao deslocamento, seu objetivo é trazer para o usuário a opção de pesquisa pelos locais utilizando a API de Geocoding do Mapbox, as instruções de navegação da rota recomendada até o destino e se conectar ao micro-serviço de navegação para que as interrupções de controladores sejam criadas

A linguagem escolhida foi o Javascript utilizando a framework React Native, que possibilita o desenvolvimento de um aplicativo completamente híbrido onde pode ser utilizado tanto por dispositivos iOS quanto em dispositivos Android.

### Topologia
![TCC - Topologia](https://github.com/vitorcont/codigo3-mobile/assets/69795902/123d043c-2c01-44e0-bb3e-5f60046b72e5)

### Comunicação com Micro-Serviço de usuários

![TCC - Diagrama de Alto Nível MS Usuário](https://github.com/vitorcont/codigo3-mobile/assets/69795902/2c0aba71-054d-478f-ab2b-abe202bc229e)

### Comunicação via WebSocket com micro-serviço de navegação

![TCC - Diagrama de Alto Nível MS Navegação](https://github.com/vitorcont/codigo3-mobile/assets/69795902/ee50d877-cf8f-4e75-84a6-6a131b98bf3d)


### Documentação
* Figma:
https://www.figma.com/file/llFPMapbh4zxdQCRs2CEvj/C%C3%B3digo-3?type=design&mode=design&t=QoY2S1gHeXr9jOOG-1


* Miro:
https://miro.com/app/board/uXjVMVdjNnE=/?share_link_id=782556678524

* Artigo:
https://docs.google.com/document/d/1bvdlZlaoFWG22HTAyyba0nRyTfcnaeWr/edit?usp=sharing&ouid=104143320451161642725&rtpof=true&sd=true

* Apresentação:
https://www.canva.com/design/DAFzNkOs5BQ/0KWGG-q07jDja5nDEO_xAw/edit?utm_content=DAFzNkOs5BQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

## Autor

Vítor Conti

https://github.com/vitorcont

---
