<?php

namespace App\Enums;

enum OpportunityStatus: string
{
    case PorContactar = 'por_contactar';
    case Contactado = 'contactado';
    case MuestraEntregada = 'muestra_entregada';
    case EnNegociacion = 'en_negociacion';
    case PrimerPedido = 'primer_pedido';
    case PuntoVentaActivo = 'punto_venta_activo';
    case NoConcretada = 'no_concretada';

    /**
     * @return array<string, string>
     */
    public static function labels(): array
    {
        return [
            'por_contactar' => 'Por contactar',
            'contactado' => 'Contactado',
            'muestra_entregada' => 'Muestra entregada',
            'en_negociacion' => 'En negociación',
            'primer_pedido' => 'Primer pedido',
            'punto_venta_activo' => 'Punto de venta activo',
            'no_concretada' => 'No concretada',
        ];
    }
}
