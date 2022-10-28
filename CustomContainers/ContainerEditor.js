var w = 120;
var h = 160;

var open = "{Pose:{Pose:{Holder:{},Door_frame:{},Door:{RY:1.605703f},Handle:{}}},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"}";
var opening = "{List:[{Random:0.0f,SetDuration:0b,Morph:{Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:10.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{RY:1.605703f},Handle:{}}},Transition:{Interp:5,Animates:1b,Duration:20},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:20.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{RY:1.605703f},Handle:{}}},Transition:{Animates:1b,Duration:20},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:12.0f,EndPoint:0b}],Name:\"sequencer\",Offset:[0.0f,0.0f,0.0f]}";
var closed = "{Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"}";
var closing = "{List:[{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{RY:1.605703f},Handle:{}}},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:10.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{RY:1.3962634E-7f},Handle:{}}},Transition:{Interp:5,Animates:1b,Duration:20},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:20.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{RY:1.3962634E-7f},Handle:{}}},Transition:{Animates:1b},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:12.0f,EndPoint:0b}],Name:\"sequencer\",Offset:[0.0f,0.0f,0.0f]}";
var locked = "{Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"}";
var trylocked = "{List:[{Random:0.0f,SetDuration:0b,Morph:{Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:5.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{},Handle:{RZ:-0.2617994f}}},Transition:{Interp:6,Animates:1b,Duration:5},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:5.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Transition:{Interp:6,Animates:1b,Duration:5},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:5.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Pose:{Pose:{Holder:{},Door_frame:{},Door:{},Handle:{RZ:-0.2617994f}}},Transition:{Interp:6,Animates:1b,Duration:5},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:5.0f,EndPoint:0b},{Random:0.0f,SetDuration:0b,Morph:{Transition:{Animates:1b,Duration:5},Skin:\"c.s:Door-1/skins/Door-1.png\",Name:\"chameleon.Door-1\"},Duration:6.0f,EndPoint:0b}],Name:\"sequencer\",Offset:[0.0f,0.0f,0.0f]}";

function main(c) {
    var root = mappet.createUI(c, 'handler').background();

    var grid = root.grid(4);
    grid.current.scroll().rwh(0.75, 0.8).rxy(0.5, 0.5).anchor(0.5, 0.5).items(5).width(w);

    addMorph(grid, 'Open', open, true);
    addMorph(grid, 'Opening', opening, true);
    addMorph(grid, 'Closed', closed, true);
    addMorph(grid, 'Closing', closing, true);
    grid.label(':)').wh(20,20);

    addSettings(grid);
    addPreview(grid);
    addOutput(grid);

    c.subject.openUI(root, true);
}

function addOutput(grid) {
    var col = grid.column(4);
    col.label('Output').labelAnchor(0.5).h(10);
    col.textarea('').h(h + 9).id('output');
    col.button('update').h(15).id('update');
    addCallback('update', function (c, elementId) {
        var context = c.player.UIContext;
        var out = JSON.stringify(formOutput(context.data));
        context.get('output').label(out);
        context.sendToPlayer();
    });
    col.button('load').h(15).id('load');
    addCallback('load', function (c, elementId) {
        var context = c.player.UIContext;
        try {
            var text = context.data.getString('output');
            var obj = JSON.parse(text);
            if (!obj || !obj.time || !obj.closedMorph || !obj.closingMorph || !obj.openMorph || !obj.openingMorph || !obj.soundClosing || !obj.soundOpening) {
                c.send(obj.soundUnlocked);
                throw new Error();
            }
            // YandereDev code
            context.get('modelx').value(obj.modelx);
            context.data.setDouble('modelx', obj.modelx);
            context.get('modely').value(obj.modely);
            context.data.setDouble('modely', obj.modely);
            context.get('modelz').value(obj.modelz);
            context.data.setDouble('modelz', obj.modelz);
            context.get('chestx').value(obj.chestx);
            context.data.setDouble('chestx', obj.chestx);
            context.get('chesty').value(obj.chesty);
            context.data.setDouble('chesty', obj.chesty);
            context.get('chestz').value(obj.chestz);
            context.data.setDouble('chestz', obj.chestz);
            context.get('time').value(obj.time);
            context.data.setDouble('time', obj.time);
            context.get('closedMorph').morph(mappet.createMorph(obj.closedMorph));
            context.data.setCompound('closedMorph', mappet.createCompound(obj.closedMorph));
            context.get('closingMorph').morph(mappet.createMorph(obj.closingMorph));
            context.data.setCompound('closingMorph', mappet.createCompound(obj.closingMorph));
            context.get('openMorph').morph(mappet.createMorph(obj.openMorph));
            context.data.setCompound('openMorph', mappet.createCompound(obj.openMorph));
            context.get('openingMorph').morph(mappet.createMorph(obj.openingMorph));
            context.data.setCompound('openingMorph', mappet.createCompound(obj.openingMorph));
            context.get('soundClosing').label(obj.soundClosing);
            context.data.setString('soundClosing', obj.soundClosing);
            context.get('soundOpening').label(obj.soundOpening);
            context.data.setString('soundOpening', obj.soundOpening);
            context.get('lock').state(obj.lock);
            context.data.setBoolean('lock', obj.lock);
            context.get('lockedMorph').morph(mappet.createMorph(locked));
            context.data.setCompound('lockedMorph', mappet.createCompound(locked));
            context.get('trylockedMorph').morph(mappet.createMorph(trylocked));
            context.data.setCompound('trylockedMorph', mappet.createCompound(trylocked));
            context.get('soundLocked').label('');
            context.data.setString('soundLocked', '');
            context.get('lockTime').value(0);
            context.data.setDouble('lockTime', 0);
            context.get('keyState').label('');
            context.data.setString('keyState', '');
            if (obj.lock) {
                context.get('lockedMorph').morph(mappet.createMorph(obj.lockedMorph));
                context.data.setCompound('lockedMorph', mappet.createCompound(obj.lockedMorph));
                context.get('trylockedMorph').morph(mappet.createMorph(obj.tryLockedMorph));
                context.data.setCompound('trylockedMorph', mappet.createCompound(obj.tryLockedMorph));
                context.get('soundLocked').label(String(obj.soundLocked));
                context.data.setString('soundLocked', obj.soundLocked);
                context.get('lockTime').value(obj.lockTime);
                context.data.setDouble('lockTime', obj.lockTime);
                context.get('keyState').label(obj.keyState);
                context.data.setString('keyState', obj.keyState);
            }
        } catch (err) {
            context.get('load').label('\u00A7cInvalid input!');
            c.scheduleScript(60, function () {
                context.get('load').label('load');
                context.sendToPlayer();
            })
        }
        context.sendToPlayer();
    });
}

function formOutput(data) {
    var out = {
        "modelx": data.getDouble('modelx'),
        "modely": data.getDouble('modely'),
        "modelz": data.getDouble('modelz'),
        "chestx": data.getDouble('chestx'),
        "chestz": data.getDouble('chesty'),
        "chesty": data.getDouble('chestz'),
        "time": data.getDouble('time'),
        "closedMorph": data.getCompound('closedMorph').stringify(),
        "closingMorph": data.getCompound('closingMorph').stringify(),
        "openMorph": data.getCompound('openMorph').stringify(),
        "openingMorph": data.getCompound('openingMorph').stringify(),
        "soundClosing": data.getString('soundClosing'),
        "soundOpening": data.getString('soundOpening'),
        "lock": false
    };
    if (data.getBoolean('lock')) {
        out.lock = true;
        out.lockedMorph = data.getCompound('lockedMorph').stringify();
        out.tryLockedMorph = data.getCompound('trylockedMorph').stringify();
        out.soundLocked = data.getString('soundLocked');
        out.lockTime = data.getDouble('lockTime');
        out.keyState = data.getString('keyState');
    }
    return out;
}

function addSettings(grid) {
    var col = grid.column(4);
    var row = col.row(1);
    row.current.h(10);
    row.label('ModelPos:').labelAnchor(0.5);
    var row = col.row(1);
    row.current.h(20);
    row.trackpad(0).id('modelx');
    row.trackpad(0).id('modely');
    row.trackpad(0).id('modelz');
    var row = col.row(1);
    row.current.h(10);
    row.label('ChestPos:').labelAnchor(0.5);
    var row = col.row(1);
    row.current.h(20);
    row.trackpad(0).id('chestx');
    row.trackpad(0).id('chesty');
    row.trackpad(0).id('chestz');
    var row = col.row(1);
    row.current.h(20);
    row.label('Time:').labelAnchor(0, 0.5);
    row.trackpad(40).id('time');
    var row = col.row(1);
    row.current.h(20);
    row.label('Sound closing:').labelAnchor(0, 0.5);
    row.textbox('').id('soundClosing');
    var row = col.row(1);
    row.current.h(20);
    row.label('Sound opening:').labelAnchor(0, 0.5);
    row.textbox('').id('soundOpening');
    var toggleLock = col.toggle('Lock').id('lock').h(20);
    addCallback('lock', function (c, elementId) {
        var context = c.player.UIContext;
        var visible = context.data.getBoolean('lock');
        context.get('soundLockedRow').visible(visible);
        context.get('keyStateRow').visible(visible);
        context.get('lockTimeRow').visible(visible);
        context.get('lockedColumn').visible(visible);
        context.get('trylockedColumn').visible(visible);
        context.get('lockedPreview').visible(visible);
        context.sendToPlayer();
    });
    var row = col.row(1);
    row.current.h(20).id('soundLockedRow').visible(false);
    row.label('Sound locked:').labelAnchor(0, 0.5);
    row.textbox('').id('soundLocked');
    var row = col.row(1);
    row.current.h(20).id('keyStateRow').visible(false);
    row.label('Key state:').labelAnchor(0, 0.5);
    row.textbox('').id('keyState');
    var row = col.row(1);
    row.current.h(20).id('lockTimeRow').visible(false);
    row.label('Lock time:').labelAnchor(0, 0.5);
    row.trackpad(25).id('lockTime');
    addMorph(grid, 'Locked', locked, false);
    addMorph(grid, 'TryLocked', trylocked, false);
}

function addPreview(grid) {
    var col = grid.column(4);
    col.label('Preview:').h(10).labelAnchor(0.5);
    var morph = col.morph(mappet.createMorph(closed));
    morph.editing(false).id('preview').h(h - 10);
    col.button('Open').h(15).id('openPreview');
    addCallback('openPreview', function (c, elementId) {
        var context = c.player.UIContext;

        var preview = context.get('preview');
        preview.morph(mappet.createMorph(context.data.getCompound('openingMorph')));
        context.sendToPlayer();
        c.scheduleScript(context.data.getDouble('time'), function () {
            preview.morph(mappet.createMorph(context.data.getCompound('openMorph')));
            context.sendToPlayer();
        });
    });
    col.button('Close').h(15).id('closePreview');
    addCallback('closePreview', function (c, elementId) {
        var context = c.player.UIContext;
        var preview = context.get('preview');
        preview.morph(mappet.createMorph(context.data.getCompound('closingMorph')));
        context.sendToPlayer();
        c.scheduleScript(context.data.getDouble('time'), function () {
            preview.morph(mappet.createMorph(context.data.getCompound('closedMorph')));
            context.sendToPlayer();
        });
    });
    col.button('Try locked').h(15).id('lockedPreview');
    addCallback('lockedPreview', function (c, elementId) {
        var context = c.player.UIContext;
        var preview = context.get('preview');
        preview.morph(mappet.createMorph(context.data.getCompound('lockedMorph')));
        context.sendToPlayer();
        c.scheduleScript(context.data.getDouble('lockTime'), function () {
            preview.morph(mappet.createMorph(context.data.getCompound('closedMorph')));
            context.sendToPlayer();
        });
    });
}

function addMorph(grid, label, morph, visible) {
    var col = grid.column(4);
    col.current.id(label.toLowerCase() + 'Column').visible(visible);
    col.label(label).h(10).labelAnchor(0.5);
    var morph = col.morph(mappet.createMorph(mappet.createCompound(morph)));
    morph.editing(true).id(label.toLowerCase() + 'Morph').h(h - 10);
}

var TL_Callbacks = {};

function addCallback(id, callbackFunction, doUpdate) {
    if (doUpdate === void 0) {
        doUpdate = true;
    }
    TL_Callbacks[id] = {
        function: callbackFunction,
        update: doUpdate,
    };
}

function handler(c) {
    var context = c.player.UIContext;
    var last = context.last;
    if (last && TL_Callbacks[last]) {
        TL_Callbacks[last].function(c, last);
        if (TL_Callbacks[last].update) {
            updateUI(c);
        }
    }
    if (last == '' && context.context && TL_Callbacks[context.context]) {
        TL_Callbacks[context.context].function(c, context.context);
        if (TL_Callbacks[context.context].update) {
            updateUI(c);
        }
    }
}

function updateUI(c){
    c.subject.UIContext.sendToPlayer();
}