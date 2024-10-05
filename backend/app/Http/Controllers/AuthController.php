<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register( RegisterRequest $request )
    {

        $data = $request->validated();

        return [
            'data' => $data
        ];

    }
}
