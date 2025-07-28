### 🔧 Custom Whisper.cpp Build Notes (streaming WASM)

See cloned Whisper.cpp [here](https://github.com/jasonsof/whisper.cpp/tree/wasm-streaming)

#### Files Modified:
- `examples/stream.wasm/emscripten.cpp` — exposes streaming-friendly bindings
- `examples/stream.wasm/CMakeLists.txt` — adds flags: `MODULARIZE=1`, `EXPORT_NAME`, increases memory limits

#### Build Instructions:
```bash
cd whisper.cpp
mkdir build-em && cd build-em
emcmake cmake .. -DWHISPER_WASM_SINGLE_FILE=ON
cmake --build . -j
```

Output:
Copy libstream.js from build/bin/ to your app’s /public/whisper/libstream.js

Copy model (ggml-tiny.en.bin) to /public/whisper/