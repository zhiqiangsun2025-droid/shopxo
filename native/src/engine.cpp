#include "engine.h"

Napi::Value Engine::Ping(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::Object obj = Napi::Object::New(env);
  obj.Set("ok", Napi::Boolean::New(env, true));
  obj.Set("message", Napi::String::New(env, "CopyEngine alive"));
  return obj;
}
