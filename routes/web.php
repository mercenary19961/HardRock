<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing Page (Public)
Route::get('/', function () {
    return Inertia::render('Landing');
})->name('home');

// TODO: Add contact form submission route
// Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Admin Dashboard (Simple authentication for you only)
// TODO: Implement simple admin dashboard
// Route::middleware('auth')->group(function () {
//     Route::get('/admin', function () {
//         return Inertia::render('Admin/Dashboard');
//     })->name('admin.dashboard');
// });

require __DIR__.'/auth.php';
