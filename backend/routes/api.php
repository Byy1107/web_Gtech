<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\OdpController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\CashflowController;
use App\Http\Controllers\MikrotikController;

Route::get('/mikrotik/disconnect/{username}', [MikrotikController::class,'disconnect']);
Route::get('/monitoring/customers', [MikrotikController::class,'monitoring']);
Route::get('/dashboard', [MikrotikController::class,'dashboard']);
Route::get('/mikrotik/secrets', [MikrotikController::class,'secrets']);
Route::get('/mikrotik/active', [MikrotikController::class,'active']);
Route::apiResource('customers', CustomerController::class);
Route::apiResource('packages', PackageController::class);
Route::apiResource('odps', OdpController::class);
Route::apiResource('invoices', InvoiceController::class);
Route::apiResource('payments', PaymentController::class);
Route::apiResource('cashflows', CashflowController::class);
Route::get('/mikrotik/active', [MikrotikController::class,'activeUsers']);
Route::get('/mikrotik/traffic', [MikrotikController::class,'getTraffic']);