<?php

namespace App\Ssr;

use Exception;
use Illuminate\Http\Client\StrayRequestException;
use Illuminate\Support\Facades\Http;
use Inertia\Ssr\HttpGateway;
use Inertia\Ssr\Response;

/**
 * SSR gateway that adds connect/response timeouts to the call to the Inertia
 * SSR sidecar (hardrock-ssr).
 *
 * Inertia's stock HttpGateway already falls back to client-side rendering when
 * the SSR call throws, but it sets no timeout — so a *hung* (not crashed) SSR
 * process blocks the request until the HTTP client's 30s default, well past
 * Railway's ~15s proxy timeout, which 502s the request before the fallback can
 * fire. With short timeouts here, a slow/unreachable SSR throws quickly, the
 * inherited try/catch returns null, and Inertia renders on the client instead.
 * The site stays up (momentarily degraded SEO) rather than 502ing site-wide.
 */
class TimeoutHttpGateway extends HttpGateway
{
    /**
     * Dispatch the Inertia page to the SSR engine via HTTP, with timeouts.
     *
     * @param  array<string, mixed>  $page
     */
    public function dispatch(array $page): ?Response
    {
        if (! $this->shouldDispatch()) {
            return null;
        }

        try {
            $response = Http::connectTimeout($this->connectTimeout())
                ->timeout($this->timeout())
                ->post($this->getUrl('/render'), $page)
                ->throw()
                ->json();
        } catch (Exception $e) {
            if ($e instanceof StrayRequestException) {
                throw $e;
            }

            // SSR unreachable/slow/errored — fall back to client-side rendering.
            return null;
        }

        if (is_null($response)) {
            return null;
        }

        return new Response(
            implode("\n", $response['head']),
            $response['body']
        );
    }

    /**
     * Determine if the SSR server is healthy, with timeouts applied.
     */
    public function isHealthy(): bool
    {
        try {
            return Http::connectTimeout($this->connectTimeout())
                ->timeout($this->timeout())
                ->get($this->getUrl('/health'))
                ->successful();
        } catch (Exception $e) {
            if ($e instanceof StrayRequestException) {
                throw $e;
            }

            return false;
        }
    }

    /**
     * Max seconds to wait for the response from the SSR sidecar.
     */
    protected function timeout(): float
    {
        return (float) config('inertia.ssr.timeout', 3);
    }

    /**
     * Max seconds to wait while establishing the TCP connection to the sidecar.
     */
    protected function connectTimeout(): float
    {
        return (float) config('inertia.ssr.connect_timeout', 2);
    }
}
