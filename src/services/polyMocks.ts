import { RiskStatusEnum } from '@mobile/enum/status';

export const mapPolygons = [
  {
    id: '0',
    status: RiskStatusEnum.EVACUATE,
    title: 'ÁREA SUJEITA A DESLIZAMENTOS',
    description: 'Saia da área se possível',
    coordinates: [
      {
        latitude: -23.4759708,
        longitude: -45.1062933,
      },
      {
        latitude: -23.4885488,
        longitude: -45.1065394,
      },
      {
        latitude: -23.4976169,
        longitude: -45.0818597,
      },
    ],
  },
  {
    id: '1',
    status: RiskStatusEnum.DANGER,
    title: 'TEMPESTADES',
    description: 'Busque abrigo imediatamente',
    coordinates: [
      {
        latitude: -22.754165,
        longitude: -47.241396,
      },
      {
        latitude: -22.492452,
        longitude: -47.360533,
      },
      {
        latitude: -22.532085,
        longitude: -47.485102,
      },
      {
        latitude: -22.830799,
        longitude: -47.437444,
      },
    ],
  },
  {
    id: '2',
    status: RiskStatusEnum.ATTENTION,
    title: 'PERIGO',
    description: 'Busque abrigo imediatamente',
    coordinates: [
      {
        latitude: -22.859366,
        longitude: -47.152416,
      },
      {
        latitude: -22.838097,
        longitude: -47.025674,
      },
      {
        latitude: -22.917051,
        longitude: -47.00014,
      },
      {
        latitude: -23.001852,
        longitude: -47.066713,
      },
      {
        latitude: -22.990094,
        longitude: -47.152451,
      },
      {
        latitude: -22.913002,
        longitude: -47.154406,
      },
    ],
  },
  // {
  //   id: '3',
  //   status: RiskStatusEnum.DANGER,
  //   title: 'PERIGO',
  //   description: 'Busque abrigo imediatamente',
  //   coordinates: [
  //     {
  //       latitude: -22.869891,
  //       longitude: -47.077768,
  //     },
  //     {
  //       latitude: -22.880852,
  //       longitude: -47.035713,
  //     },
  //     {
  //       latitude: -22.895917,
  //       longitude: -47.084783,
  //     },
  //   ],
  // },
];
