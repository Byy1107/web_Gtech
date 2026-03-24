<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\MikrotikController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\OdpController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\CashflowController;


/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);


/*
|--------------------------------------------------------------------------
| DASHBOARD + MONITORING (NO AUTH FOR NOW)
|--------------------------------------------------------------------------
| Supaya frontend React bisa langsung akses API
*/

Route::get('/dashboard', [DashboardController::class, 'index']);
Route::get('/dashboard/traffic', [DashboardController::class, 'traffic']);

Route::get('/mikrotik/active', [MikrotikController::class, 'activeUsers']);
Route::get('/mikrotik/traffic', [MikrotikController::class, 'getTraffic']);
Route::get('/mikrotik/secrets', [MikrotikController::class, 'secrets']);
Route::get('/mikrotik/disconnect/{username}', [MikrotikController::class, 'disconnect']);

Route::get('/monitoring/customers', [MikrotikController::class, 'monitoring']);


/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES
|--------------------------------------------------------------------------
| Ini untuk fitur admin panel nanti
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // CRUD DATA

    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('packages', PackageController::class);
    Route::apiResource('odps', OdpController::class);

    Route::apiResource('invoices', InvoiceController::class);
    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('cashflows', CashflowController::class);

});