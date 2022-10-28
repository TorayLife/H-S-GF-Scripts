var example = {
    "modelx":1251,
    "modely":92,
    "modelz":-496,
    "chestx":1251,
    "chesty":91,
    "chestz":-496,
    "time":40,
    "closedMorph": "{Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"}",
    "lockedMorph": "{Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"}",
    "tryLockedMorph": "{Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"}",
    "closingMorph": "{List:[{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{RY:1.605703f},Handle:{}}},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:10.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{RY:1.3962634E-7f},Handle:{}}},Transition:{Interp:5,Animates:1b,Duration:20},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:20.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{RY:1.3962634E-7f},Handle:{}}},Transition:{Animates:1b},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:12.0f,EndPoint:0b}],Name:\"sequencer\",Offset:[0.0f,0.0f,0.0f]}",
    "openMorph": "{Pose:{Pose:{Holder:{},Door_frame:{},Door:{RY:1.605703f},Handle:{}}},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"}",
    "openingMorph": "{List:[{Random:0.0f,SetDuration:0b,Morph:{Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:10.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{RY:1.605703f},Handle:{}}},Transition:{Interp:5,Animates:1b,Duration:20},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:20.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{RY:1.605703f},Handle:{}}},Transition:{Animates:1b,Duration:20},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:12.0f,EndPoint:0b}],Name:\"sequencer\",Offset:[0.0f,0.0f,0.0f]}",
    "soundClosing": "minecraft:block.metal.hit",
    "soundOpening": "minecraft:block.metal.hit",
    "soundLocked": "minecraft:block.metal.place",
    "lock": true,
    "lockTime": 25,
    "keyState": "testState"
}

function main(c){
    try {
        var posTrigger = getPos(c, '');
        var posModel = getPos(c, 'model');
        var posChest = getPos(c, 'chest');
        var morphs = {
            open: c.getValue('openMorph'),
            closing: c.getValue('closingMorph'),
            closed: c.getValue('closedMorph'),
            opening: c.getValue('openingMorph'),
            tryLocked: c.getValue('tryLockedMorph'),
            locked: c.getValue('lockedMorph'),
        }
        var tileModel = c.world.getTileEntity(posModel.x, posModel.y, posModel.z);
        var tileChest = c.world.getTileEntity(posChest.x, posChest.y, posChest.z);

        var isBlocked = !!tileModel.tileData.getBoolean('blocked');
        var isLocked = !!tileModel.tileData.getBoolean('locked');
        var hasPlayerWithState = Java.from(c.world.getEntities(posTrigger.x, posTrigger.y, posTrigger.z, 8)).filter(function (player){
            return player.states.getString('openedCustomChest') == JSON.stringify(posChest);
        }).length >= 1;
        if (isBlocked && hasPlayerWithState) {
            return;
        }
        if(isLocked && player.states.getNumber(c.getValue('keyState'))){
            tileModel.tileData.setBoolean('locked', false);
            isLocked = false;
        }
        if(isLocked){
            setMorph(c, posModel, tileModel, morphs.tryLocked);
            c.world.playSound(c.getValue('soundLocked'), posTrigger.x, posTrigger.y, posTrigger.z, 1, 1);
            c.scheduleScript(c.getValue('lockTime'), function () {
                setMorph(c, posModel, tileModel, morphs.locked);
            });
            return;
        }
        tileModel.tileData.setBoolean('blocked', true);

        setMorph(c, posModel, tileModel, morphs.opening);
        c.world.playSound(c.getValue('soundOpening'), posTrigger.x, posTrigger.y, posTrigger.z, 1, 1);
        c.scheduleScript(c.getValue('time'), function () {
            try {
                openContainer(c, posChest);
                c.player.states.setString('openedCustomChest', JSON.stringify(posChest));
                writeStringToTile(tileChest, 'data', JSON.stringify({
                    posModel: posModel,
                    posTrigger: posTrigger,
                    morphs: morphs,
                    closeSound: c.getValue('soundClosing')
                }));
                setMorph(c, posModel, tileModel, morphs.open);
            }
            catch(err){
                c.send(err);
            }
        });
    } catch (e) {
        c.send(e);
    }
}

function login(c){
    c.player.states.setString('openedCustomChest', '');
}

function logout(c){
    var posChest = c.player.states.getString('openedCustomChest');
    unblockChest(c, posChest);
}

function containerClosed(c){
    var posChest = getPos(c, '');
    unblockChest(c, posChest);
}

function unblockChest(c, posChest){
    var tileChest = c.world.getTileEntity(posChest.x, posChest.y, posChest.z);
    if(!tileChest.tileData.has('data')){
        return;
    }
    var data = JSON.parse(tileChest.tileData.getString('data'));
    var tileModel = c.world.getTileEntity(data.posModel.x, data.posModel.y, data.posModel.z);
    setMorph(c, data.posModel, tileModel, data.morphs.closing);
    c.world.playSound(data.closeSound, data.posTrigger.x, data.posTrigger.y, data.posTrigger.z, 1, 1);
    c.scheduleScript(40, function(){
        setMorph(c, data.posModel, tileModel, data.morphs.closed);
        tileModel.tileData.setBoolean('blocked', false);
        c.player.states.setString('openedCustomChest', '');
    });
}

function openContainer(c, pos) {
    var mcPlayer = c.player.minecraftPlayer;
    var chest = c.world.getInventory(pos.x, pos.y, pos.z).minecraftInventory;
    mcPlayer.func_71007_a(chest); //displayGUIChest
}

function getPos(c, name){
    return {x:c.getValue(name+'x'), y:c.getValue(name+'y'), z:c.getValue(name+'z')}
}

function writeStringToTile(tileEntity, name, value){
    tileEntity.tileData.setString(name, value);
}

function setMorph(c, posModel, tile, morph) {
    var tileMC = tile.minecraftTileEntity;
    tileMC.setMorph(mappet.createMorph(morph));
    sendPacketModifyModelBlock(c, posModel, tileMC);
}

// Thanks to McHorse for helping with update a model block
function sendPacketModifyModelBlock(c, blockpos, tile) {
    var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
    var Dispatcher = Java.type('mchorse.blockbuster.network.Dispatcher');
    var PacketModifyModelBlock = Java.type('mchorse.blockbuster.network.common.PacketModifyModelBlock');
    var NetworkRegistry = Java.type('net.minecraftforge.fml.common.network.NetworkRegistry');
    var pos = API.getIPos(blockpos.x, blockpos.y, blockpos.z).getMCBlockPos();
    var message = new PacketModifyModelBlock(pos, tile);
    var dimId = c.world.getDimensionId();
    var point = new NetworkRegistry.TargetPoint(dimId, pos.func_177958_n(), pos.func_177956_o(), pos.func_177952_p(), 64);
    Dispatcher.DISPATCHER.get().sendToAllAround(message, point);
}