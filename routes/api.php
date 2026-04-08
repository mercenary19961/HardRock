<?php

use App\Http\Controllers\Api\LeadController;
use Illuminate\Support\Facades\Route;

Route::middleware('api.key')->group(function () {
    Route::post('/leads', [LeadController::class, 'store'])
        ->middleware('throttle:30,1')
        ->name('api.leads.store');
});
