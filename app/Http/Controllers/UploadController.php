<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Pion\Laravel\ChunkUpload\Handler\ContentRangeUploadHandler;
use Pion\Laravel\ChunkUpload\Receiver\FileReceiver;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function __invoke(Request $request)
    {
        $receiver = new FileReceiver(
            UploadedFile::fake()->createWithContent('file', $request->getContent()),
            $request,
            ContentRangeUploadHandler::class
        );

        $save = $receiver->receive();

        if ($save->isFinished()) {
            $save->getFile()->storeAs('uploads', Str::uuid());
        }

        $save->handler();
    }
}
