#!/bin/zsh
EMCC_PATH=src
if [ ! -d $EMCC_PATH ] 
then
    echo "Downloading emcc!"
    git clone git@github.com:emscripten-core/emsdk.git
    mv emsdk $EMCC_PATH
fi
cd $EMCC_PATH
./emsdk install latest
./emsdk activate latest
cd ..
node changeMemory.cjs
cd $EMCC_PATH
echo "export EMSDK=`pwd`" >> ~/.zshrc
echo "export EM_CONFIG="$EMSDK/.emscripten"" >> ~/.zshrc
echo "export EMSDK_NODE="$EMSDK/node/16.20.0_64bit/bin/node"" >> ~/.zshrc
echo "export PATH="$PATH:$EMSDK/upstream/bin/:$EMSDK/upstream/emscripten/:$EMSDK/node/16.20.0_64bit/bin/"" >> ~/.zshrc
source $HOME/.zshrc
