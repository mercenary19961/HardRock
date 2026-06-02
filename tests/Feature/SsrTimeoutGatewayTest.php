<?php

namespace Tests\Feature;

use App\Ssr\TimeoutHttpGateway;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Inertia\Ssr\Gateway;
use Tests\TestCase;

class SsrTimeoutGatewayTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Enable SSR and skip on-disk bundle detection so dispatch() proceeds.
        config([
            'inertia.ssr.enabled' => true,
            'inertia.ssr.url' => 'http://ssr.test:13714',
            'inertia.ssr.ensure_bundle_exists' => false,
        ]);
    }

    public function test_app_resolves_the_timeout_gateway_over_inertias_default(): void
    {
        $this->assertInstanceOf(TimeoutHttpGateway::class, app(Gateway::class));
    }

    public function test_dispatch_falls_back_to_client_rendering_when_ssr_is_unreachable(): void
    {
        // Simulate a hung/unreachable sidecar: the HTTP call throws instead of
        // returning. With a timeout in place this is what Inertia would see.
        Http::fake(fn () => throw new ConnectionException('Connection timed out'));

        $result = (new TimeoutHttpGateway)->dispatch(['component' => 'Landing', 'props' => []]);

        // null == "render on the client" — the request succeeds instead of 502ing.
        $this->assertNull($result);
    }

    public function test_dispatch_returns_rendered_response_when_ssr_is_healthy(): void
    {
        Http::fake([
            '*/render' => Http::response([
                'head' => ['<title>HardRock</title>'],
                'body' => '<div id="app">hello</div>',
            ]),
        ]);

        $result = (new TimeoutHttpGateway)->dispatch(['component' => 'Landing', 'props' => []]);

        $this->assertNotNull($result);
        $this->assertSame('<title>HardRock</title>', $result->head);
        $this->assertSame('<div id="app">hello</div>', $result->body);
    }
}
