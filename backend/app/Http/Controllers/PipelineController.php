<?php

namespace App\Http\Controllers;


use App\Models\Pipeline;

use Illuminate\Http\Request;

class PipelineController extends Controller
{
    public function index()
    {
        return Pipeline::with('stages')->get();
    }
}
