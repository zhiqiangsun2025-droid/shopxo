cmake_minimum_required(VERSION 3.16)
project(CopyEngine)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

# Node.js and N-API
add_definitions(-DNAPI_VERSION=8)

# Include directories provided by cmake-js (Node headers)
if(DEFINED CMAKE_JS_INC)
  include_directories(${CMAKE_JS_INC})
  message(STATUS "Using CMAKE_JS_INC=${CMAKE_JS_INC}")
else()
  message(STATUS "CMAKE_JS_INC not defined; building without cmake-js")
endif()

# Include node-addon-api headers from node_modules
execute_process(
  COMMAND node -p "require('node-addon-api').include"
  WORKING_DIRECTORY ${CMAKE_CURRENT_LIST_DIR}
  OUTPUT_VARIABLE NODE_ADDON_API_DIR
  ERROR_QUIET
)
string(REPLACE "\n" "" NODE_ADDON_API_DIR "${NODE_ADDON_API_DIR}")
string(REPLACE "\"" "" NODE_ADDON_API_DIR "${NODE_ADDON_API_DIR}")
if(NODE_ADDON_API_DIR)
  include_directories(${NODE_ADDON_API_DIR})
else()
  message(WARNING "node-addon-api include path not found; ensure it is installed")
endif()

add_library(CopyEngine MODULE src/addon.cpp src/engine.cpp)

# On macOS/Linux, set the right extension and visibility
set_target_properties(CopyEngine PROPERTIES
  PREFIX ""
  SUFFIX ".node"
)

# Link against Node if provided by cmake-js
if(DEFINED CMAKE_JS_LIB)
  target_link_libraries(CopyEngine ${CMAKE_JS_LIB})
endif()

# Linux: link stdc++fs if needed (older toolchains)
# target_link_libraries(CopyEngine PRIVATE stdc++fs)
