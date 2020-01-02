// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-

const { Clutter, Gtk, Meta, Shell } = imports.gi;

const Gettext = imports.gettext.domain('gnome-shell-extensions');
const _ = Gettext.gettext;

const Main = imports.ui.main;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const PanelBox = Me.imports.panelBox.PanelBox;

const SCHEMA = 'org.gnome.shell.extensions.floatingPanel';
const HOTKEY = 'floating-panel-hotkey';
const DIRECTION = 'floating-panel-direction';

class FloatBox {
    constructor() {
        this._gsettings = Convenience.getSettings(SCHEMA);
        this.direction = this._gsettings.get_string(DIRECTION);

        this.panelBox = new PanelBox(this.direction);
        this.directionID = this._gsettings.connect("changed::" + DIRECTION, () => {
            this.direction = this._gsettings.get_string(DIRECTION);
            this.panelBox.destroy();
            this.panelBox = new PanelBox(this.direction);
        });

        this._addKeybinding();
    }

    _addKeybinding() {
        let ModeType = Shell.hasOwnProperty('ActionMode') ?
                       Shell.ActionMode : Shell.KeyBindingMode;

        Main.wm.addKeybinding(HOTKEY,
                              this._gsettings,
                              Meta.KeyBindingFlags.NONE,
                              ModeType.ALL,
                              () => { this.panelBox.showItem(); });
    }

    destroy() {
        Main.wm.removeKeybinding(HOTKEY);
        this.panelBox.destroy();
    }
}

let floatBox;

function init(metadata) {
    let theme = imports.gi.Gtk.IconTheme.get_default();
    theme.append_search_path(metadata.path + '/icons');
}

function enable() {
    floatBox = new FloatBox();
}

function disable() {
    floatBox.destroy();
    floatBox = null;
}