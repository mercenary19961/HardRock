<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $language = in_array($request->cookie('language'), ['en', 'ar'], true)
            ? $request->cookie('language')
            : 'en';

        $theme = in_array($request->cookie('theme'), ['light', 'dark'], true)
            ? $request->cookie('theme')
            : 'dark';

        app()->setLocale($language);

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'appearance' => [
                'language' => $language,
                'theme' => $theme,
            ],
        ];
    }
}
