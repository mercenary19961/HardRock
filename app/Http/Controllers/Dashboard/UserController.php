<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of team members.
     */
    public function index(): Response
    {
        $users = User::orderBy('created_at', 'desc')->get([
            'id',
            'name',
            'email',
            'is_admin',
            'created_at',
        ]);

        return Inertia::render('Dashboard/Users', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created team member.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', Password::defaults()],
            'is_admin' => ['boolean'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_admin' => $validated['is_admin'] ?? false,
        ]);

        return back()->with('success', 'Team member added successfully.');
    }

    /**
     * Update the specified team member.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        // Prevent demoting yourself from admin
        if ($user->id === $request->user()->id && $request->has('is_admin') && !$request->is_admin) {
            return back()->withErrors(['is_admin' => 'You cannot remove your own admin privileges.']);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', Password::defaults()],
            'is_admin' => ['boolean'],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->is_admin = $validated['is_admin'] ?? false;

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return back()->with('success', 'Team member updated successfully.');
    }

    /**
     * Remove the specified team member.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        // Prevent deleting yourself
        if ($user->id === $request->user()->id) {
            return back()->withErrors(['delete' => 'You cannot delete your own account.']);
        }

        /** @var \Illuminate\Database\Eloquent\Model $user */
        $user->delete();

        return back()->with('success', 'Team member removed successfully.');
    }
}
