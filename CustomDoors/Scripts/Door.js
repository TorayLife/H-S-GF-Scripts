var example = {
    "offsetY": -3,
    "time": 40,
    "closedMorph": "{Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"}",
    "closingMorph": "{List:[{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{RY:1.605703f},Handle:{}}},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:10.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{RY:1.3962634E-7f},Handle:{}}},Transition:{Interp:5,Animates:1b,Duration:20},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:20.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{RY:1.3962634E-7f},Handle:{}}},Transition:{Animates:1b},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:12.0f,EndPoint:0b}],Name:\"sequencer\",Offset:[0.0f,0.0f,0.0f]}",
    "openMorph": "{Pose:{Pose:{Holder:{},Door_frame:{},Door:{RY:1.605703f},Handle:{}}},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"}",
    "openingMorph": "{List:[{Random:0.0f,SetDuration:0b,Morph:{Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:10.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{RY:1.605703f},Handle:{}}},Transition:{Interp:5,Animates:1b,Duration:20},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:20.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{RY:1.605703f},Handle:{}}},Transition:{Animates:1b,Duration:20},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:12.0f,EndPoint:0b}],Name:\"sequencer\",Offset:[0.0f,0.0f,0.0f]}",
    "lockedMorph": "{List:[{Random:0.0f,SetDuration:0b,Morph:{Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:5.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{},Handle:{RZ:-0.2617994f}}},Transition:{Interp:6,Animates:1b,Duration:5},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:5.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Transition:{Interp:6,Animates:1b,Duration:5},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:5.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{},Handle:{RZ:-0.2617994f}}},Transition:{Interp:6,Animates:1b,Duration:5},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:5.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Transition:{Animates:1b,Duration:5},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:6.0f,EndPoint:0b}],Name:\"sequencer\",Offset:[0.0f,0.0f,0.0f]}",
    "soundClosing": "minecraft:block.metal.hit",
    "soundOpening": "minecraft:block.metal.hit",
    "soundLocked": "minecraft:block.metal.place",
    "lock": true,
    "lockTime": 25,
    "keyState": "testState"
}

function main(c) {
    var pos = {x: c.getValue('x'), y: c.getValue('y'), z: c.getValue('z')};
    var posOffset = {x: pos.x, y: pos.y + c.getValue('offsetY'), z: pos.z};
    var tile = c.world.getTileEntity(posOffset.x, posOffset.y, posOffset.z);
    var tileMC = tile.minecraftTileEntity;
    var tileData = tile.tileData;
    var isOpen = !!tileData.getBoolean('doorOpen');
    var hasKey = !!c.player.states.getNumber(c.getValue('keyState'));
    var isLocked = !!c.getValue('lock');
    var isBlocked = !!tileData.getBoolean('blocked');
    if (isBlocked) {
        return;
    }
    tileData.setBoolean('blocked', true);

    if (!isOpen && isLocked && !hasKey) {
        setMorph(c, posOffset, tileMC, 'lockedMorph');
        c.scheduleScript(c.getValue('lockTime'), function () {
            setMorph(c, posOffset, tileMC, 'closedMorph');
            tileData.setBoolean('blocked', false);
        });
        c.world.playSound(c.getValue('soundLocked'), pos.x, pos.y, pos.z, 1, 1);
        return;
    }

    c.world.playSound(c.getValue(isOpen ? 'soundClosing' : 'soundOpening'), pos.x, pos.y, pos.z, 1, 1);

    tileData.setBoolean('doorOpen', !isOpen);

    c.world.setBlock(mappet.createBlockState(isOpen ? 'minecraft:barrier' : 'minecraft:air', 0), pos.x, pos.y - 1, pos.z);
    var blockTrigger = c.world.getTileEntity(pos.x, pos.y, pos.z).minecraftTileEntity;
    blockTrigger.set(blockTrigger.leftClick.serializeNBT(), blockTrigger.rightClick.serializeNBT(), isOpen);

    setMorph(c, posOffset, tileMC, isOpen ? 'closingMorph' : 'openingMorph');
    c.scheduleScript(c.getValue('time'), function () {
        setMorph(c, posOffset, tileMC, isOpen ? 'closedMorph' : 'openMorph');
        tileData.setBoolean('blocked', false);
    });
}


function setMorph(c, posOffset, tileMC, morphName) {
    tileMC.setMorph(mappet.createMorph(c.getValue(morphName)));
    sendPacketModifyModelBlock(c, posOffset, tileMC);
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