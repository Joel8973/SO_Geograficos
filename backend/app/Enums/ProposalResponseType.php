<?php

namespace App\Enums;

enum ProposalResponseType: string
{
    case MeInteresa = 'me_interesa';
    case SolicitoInformacion = 'solicito_informacion';
    case AgendarVisita = 'agendar_visita';
    case NoInteresado = 'no_interesado';

    /**
     * @return array<string, string>
     */
    public static function labels(): array
    {
        return [
            'me_interesa' => 'Me interesa',
            'solicito_informacion' => 'Solicito informacion',
            'agendar_visita' => 'Agendar visita',
            'no_interesado' => 'No interesado',
        ];
    }
}
