#pragma once
#include <napi.h>

class Engine {
public:
  static Napi::Value Ping(const Napi::CallbackInfo& info);
};
