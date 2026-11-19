<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        // MySQL 8+: el atributo SRID debe ir DESPUÉS de "GENERATED ALWAYS AS ... STORED".
        // La columna es NOT NULL porque MySQL solo indexa espacialmente columnas NOT NULL con SRID.
        // COALESCE evita NULL cuando el comercio aún no tiene coordenadas cargadas.
        DB::statement("
            ALTER TABLE `establishments`
            ADD `location` POINT
            GENERATED ALWAYS AS (
                ST_SRID(POINT(COALESCE(`longitude`, 0), COALESCE(`latitude`, 0)), 4326)
            ) STORED NOT NULL SRID 4326
        ");

        DB::statement('CREATE SPATIAL INDEX `establishments_location_spatial` ON `establishments` (`location`)');
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::statement('DROP INDEX `establishments_location_spatial` ON `establishments`');
        DB::statement('ALTER TABLE `establishments` DROP COLUMN `location`');
    }
};
