#include <napi.h>
#include "engine.h"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "ping"), Napi::Function::New(env, Engine::Ping));
  return exports;
}

NODE_API_MODULE(CopyEngine, Init)
