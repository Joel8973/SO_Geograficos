<?php

namespace App\Http\Controllers;

use App\Enums\OpportunityStatus;
use App\Models\Establishment;
use App\Models\Opportunity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OpportunityController extends Controller
{
    // Consultar mis oportunidades
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->opportunities()
                ->with('establishment')
                ->latest()
                ->get()
        );
    }

    // Guardar un establecimiento como oportunidad
    public function store(Request $request)
    {
        abort_unless($request->user()->hasRole('emprendedor'), 403);

        $datos = $request->validate([
            'establishment_id' => [
                'required',
                'integer',
                'exists:establishments,id'
            ],
        ]);

        $establecimiento = Establishment::findOrFail(
            $datos['establishment_id']
        );

        $oportunidad = $request->user()
            ->opportunities()
            ->firstOrCreate(
                ['establishment_id' => $establecimiento->id],
                ['status' => OpportunityStatus::PorContactar]
            );

        return response()->json(
            $oportunidad->load('establishment'),
            $oportunidad->wasRecentlyCreated ? 201 : 200
        );
    }

    // Actualizar estado, notas y seguimiento
    
public function update(Request $request, Opportunity $opportunity)
{
    abort_unless(
        (int) $opportunity->user_id === (int) $request->user()->id,
        403
    );

    $datos = $request->validate([
        'status' => [
            'sometimes',
            'required',
            Rule::enum(OpportunityStatus::class)
        ],
        'private_notes' => 'sometimes|nullable|string',
        'next_follow_up_at' => 'sometimes|nullable|date',
        'agreed_conditions' => 'sometimes|nullable|string',
    ]);

    DB::transaction(function () use ($opportunity, $datos, $request) {
        $nuevoEstado = isset($datos['status'])
            ? OpportunityStatus::from($datos['status'])
            : null;

        unset($datos['status']);

        $opportunity->fill($datos);
        $opportunity->save();

        if ($nuevoEstado !== null && $opportunity->status !== $nuevoEstado) {
            $opportunity->changeStatus(
                $nuevoEstado,
                null,
                $request->user()->id
            );
        }   
    });

    return response()->json(
        $opportunity->fresh()->load('establishment')
    );
    }

}
