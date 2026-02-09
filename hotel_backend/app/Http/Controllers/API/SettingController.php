<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Get all settings
     */
    public function index()
    {
        $settings = Setting::pluck('value', 'key');
        return response()->json($settings);
    }

    /**
     * Update settings
     */
    public function update(Request $request)
    {
        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*' => 'nullable|string'
        ]);

        foreach ($data['settings'] as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Paramètres mis à jour avec succès',
            'data' => Setting::pluck('value', 'key')
        ]);
    }
}
