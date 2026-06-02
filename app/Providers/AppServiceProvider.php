<?php

namespace App\Providers;

use App\Ssr\TimeoutHttpGateway;
use Illuminate\Support\ServiceProvider;
use Inertia\Ssr\Gateway;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force HTTPS in production
        if ($this->app->environment('production')) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        // Override Inertia's SSR gateway with one that applies timeouts, so a
        // hung/unreachable SSR sidecar falls back to client-side rendering
        // instead of blocking until Railway's proxy 502s the whole site.
        // Bound in boot() (not register()) so it wins over Inertia's own
        // register()-time binding regardless of provider order.
        $this->app->bind(Gateway::class, TimeoutHttpGateway::class);
    }
}
