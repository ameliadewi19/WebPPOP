<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // $user = $request->user();
        $user = auth()->user();

        if (!in_array($user->role, $roles)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        } else {
            return response()->json(['success' => 'Role ', $user->role], 200);
        }

        return $next($request);
    }
}
