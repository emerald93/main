Ext.data.JsonP.keyboard_nav({"guide":"<h1>Keyboard Navigation</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/keyboard_nav-section-1'>Getting Started</a></li>\n<li><a href='#!/guide/keyboard_nav-section-2'>The Focus Manager</a></li>\n<li><a href='#!/guide/keyboard_nav-section-3'>KeyNav</a></li>\n<li><a href='#!/guide/keyboard_nav-section-4'>KeyMap</a></li>\n<li><a href='#!/guide/keyboard_nav-section-5'>Conclusion</a></li>\n</ol>\n</div>\n\n<hr />\n\n<p>Navigating with your keyboard is often faster than using the cursor and is useful for both power users and to provide accessibility to users that find a mouse difficult to use.</p>\n\n<p>We're going to convert a modified version of the relatively complicated Ext JS <a href=\"#!/example/layout/complex.html\">complex layout example</a> into an application that is fully accessible through the keyboard. We'll also add keyboard shortcuts to potentially make navigation via the keyboard faster than the cursor.</p>\n\n<p>By the end of this guide you will have an understanding of where keyboard navigation is most needed and how to utilize keyboard navigation with <a href=\"#!/api/Ext.util.KeyNav\" rel=\"Ext.util.KeyNav\" class=\"docClass\">KeyNav</a>, <a href=\"#!/api/Ext.util.KeyMap\" rel=\"Ext.util.KeyMap\" class=\"docClass\">KeyMap</a> and the <a href=\"#!/api/Ext.FocusManager\" rel=\"Ext.FocusManager\" class=\"docClass\">FocusManager</a>.</p>\n\n<h2 id='keyboard_nav-section-1'>Getting Started</h2>\n\n<p><a href=\"guides/keyboard_nav/start.zip\">These are the files we'll be starting from</a>. Unzip them and open complex.html and complex.js in your preferred editor. Also unzip a copy of Ext JS 4 into the same directory and rename it 'ext'.</p>\n\n<h2 id='keyboard_nav-section-2'>The Focus Manager</h2>\n\n<p>The Focus Manager provides a very quick way to enable basic keyboard navigation. What's more, it's simple to implement:</p>\n\n<pre><code><a href=\"#!/api/Ext.FocusManager-event-enable\" rel=\"Ext.FocusManager-event-enable\" class=\"docClass\">Ext.FocusManager.enable</a>(true);\n</code></pre>\n\n<p>Write this line inside <a href=\"#!/api/Ext-method-onReady\" rel=\"Ext-method-onReady\" class=\"docClass\">Ext.onReady</a>; we pass the <a href=\"#!/api/Boolean\" rel=\"Boolean\" class=\"docClass\">Boolean</a> <code>true</code> to show a \"visual cue\" in the form of a blue ring around the focused area (this is known as a focus frame). This focus frame makes it easy to see at a glance which area has focus. The user presses Enter to enter the application and then move up and down 'levels', with Enter to go down a level and Backspace or Escape to go up a level. The Tab key can be used to jump between sibling elements (those that are on the same level).</p>\n\n<p>Experiment with navigating around the elements solely with the FocusManager. If you can, turn off your mouse too. Although adequate, you'll probably find that certain areas are either inaccessible (such as the grid) or it's quite cumbersome to get around the screen. We're going to tackle this with 'shortcuts' which will allow users to jump to certain panels of the application with ease.</p>\n\n<p>When deciding which panels should have shortcuts to them it's useful to have some criteria to go by:</p>\n\n<ul>\n<li>Is it often used?</li>\n<li>Could it be used as an anchor - that is, could it provide a stepping stone to make other remote areas easier to get to?</li>\n<li>Does it feel intuitive to navigate to?</li>\n</ul>\n\n\n<p>If the answer is yes to at least one of these, give it a keyboard shortcut and aid your end-users.</p>\n\n<h2 id='keyboard_nav-section-3'>KeyNav</h2>\n\n<p>It's the job of KeyNav to provide easy keyboard navigation. It allows you to use the following keys to navigate through your Ext JS application:</p>\n\n<ul>\n<li>Enter</li>\n<li>Space</li>\n<li>Left</li>\n<li>Right</li>\n<li>Up</li>\n<li>Down</li>\n<li>Tab</li>\n<li>Escape</li>\n<li>Page Up</li>\n<li>Page Down</li>\n<li>Delete</li>\n<li>Backspace</li>\n<li>Home</li>\n<li>End</li>\n</ul>\n\n\n<p>It's also worth keeping in mind users with limited keyboards that might not have certain keys, for example certain Apple computers don't have Page Up, Page Down, Del, Home or End keys. Let's take a look at an example of how you'd use it.</p>\n\n<pre><code>var nav = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.util.KeyNav\" rel=\"Ext.util.KeyNav\" class=\"docClass\">Ext.util.KeyNav</a>', \"my-element\", {\n    \"left\" : function(e){\n        this.moveLeft(e.ctrlKey);\n    },\n    \"right\" : function(e){\n        this.moveRight(e.ctrlKey);\n    },\n    \"enter\" : function(e){\n        this.save();\n    },\n    scope : this\n});\n</code></pre>\n\n<p>KeyNav's speciality is listening for arrow keys, so we're going to add the ability to navigate around panels with the arrow keys instead of having to use tab, enter and escape.</p>\n\n<pre><code>var nav = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.util.KeyNav\" rel=\"Ext.util.KeyNav\" class=\"docClass\">Ext.util.KeyNav</a>', <a href=\"#!/api/Ext-method-getBody\" rel=\"Ext-method-getBody\" class=\"docClass\">Ext.getBody</a>(), {\n    \"left\" : function(){\n        var el = <a href=\"#!/api/Ext.FocusManager-property-focusedCmp\" rel=\"Ext.FocusManager-property-focusedCmp\" class=\"docClass\">Ext.FocusManager.focusedCmp</a>;\n        if (el.previousSibling()) el.previousSibling().focus();\n    },\n    \"right\" : function(){\n        var el = <a href=\"#!/api/Ext.FocusManager-property-focusedCmp\" rel=\"Ext.FocusManager-property-focusedCmp\" class=\"docClass\">Ext.FocusManager.focusedCmp</a>;\n        if (el.nextSibling()) el.nextSibling().focus();\n    },\n    \"up\" : function() {\n        var el = <a href=\"#!/api/Ext.FocusManager-property-focusedCmp\" rel=\"Ext.FocusManager-property-focusedCmp\" class=\"docClass\">Ext.FocusManager.focusedCmp</a>;\n        if (el.up()) el.up().focus();\n    },\n    \"down\" : function() {\n        var el = <a href=\"#!/api/Ext.FocusManager-property-focusedCmp\" rel=\"Ext.FocusManager-property-focusedCmp\" class=\"docClass\">Ext.FocusManager.focusedCmp</a>;\n        if (el.items) el.items.items[0].focus();\n    },\n    scope : this\n});\n</code></pre>\n\n<p>We get the currently focused component with <a href=\"#!/api/Ext.FocusManager-property-focusedCmp\" rel=\"Ext.FocusManager-property-focusedCmp\" class=\"docClass\">focusedCmp</a>. If the function has a value other than <code>null</code>, we focus on the element that we want, be it the previous sibling with the Left arrow key or the first child component with the Down key. Already we've made our application much easier to navigate. Next, we're going to look at <a href=\"#!/api/Ext.util.KeyMap\" rel=\"Ext.util.KeyMap\" class=\"docClass\">Ext.util.KeyMap</a> and how to add specific functionality to keys.</p>\n\n<h2 id='keyboard_nav-section-4'>KeyMap</h2>\n\n<p>You'll notice that there are many regions to our Ext application: North, South, East, and West. We're going to create a <a href=\"#!/api/Ext.util.KeyMap\" rel=\"Ext.util.KeyMap\" class=\"docClass\">KeyMap</a> that will not only focus on these elements but, if the region is collapsed, expand it too. Let's have a look at what a typical KeyMap object looks like.</p>\n\n<pre><code>var map = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.util.KeyMap\" rel=\"Ext.util.KeyMap\" class=\"docClass\">Ext.util.KeyMap</a>', \"my-element\", {\n    key: 13, // or <a href=\"#!/api/Ext.EventObject-property-ENTER\" rel=\"Ext.EventObject-property-ENTER\" class=\"docClass\">Ext.EventObject.ENTER</a>\n    ctrl: true,\n    shift: false,\n    fn: myHandler,\n    scope: myObject\n});\n</code></pre>\n\n<p>The first property, <code>key</code> is the numeric keycode that maps a key. A useful document that maps which numbers correlate to which keys can be <a href=\"#!/api/Ext.EventObject\" rel=\"Ext.EventObject\" class=\"docClass\">found here</a>. The next two, <code>ctrl</code> and <code>shift</code>, specify if the respective key is required to be held down to activate the function. In our case ctrl does, so ctrl+Enter will invoke <code>myHandler</code>. <code>fn</code> is the function to be called. This can either be inline or a reference to a function. Finally, <code>scope</code> defines where this <code>KeyMap</code> will be effective.</p>\n\n<p><code>KeyMap</code> is versatile in that it allows you to specify either one key that carries out a function or an array of keys that carry out the same function. If we wanted a number of keys to invoke <code>myHandler</code> we'd write it like <code>key: [10, 13]</code>.</p>\n\n<p>We'll start by concentrating on the main panels: north, south, east and west.</p>\n\n<pre><code>var map = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.util.KeyMap\" rel=\"Ext.util.KeyMap\" class=\"docClass\">Ext.util.KeyMap</a>', <a href=\"#!/api/Ext-method-getBody\" rel=\"Ext-method-getBody\" class=\"docClass\">Ext.getBody</a>(), [\n    {\n        key: <a href=\"#!/api/Ext.EventObject-property-E\" rel=\"Ext.EventObject-property-E\" class=\"docClass\">Ext.EventObject.E</a>, // E for east\n        shift: true,\n        ctrl: false, // explicitly set as false to avoid collisions\n        fn: function() {\n            var parentPanel = eastPanel;\n            expand(parentPanel);\n        }\n    },\n    {\n        key: <a href=\"#!/api/Ext.EventObject-property-W\" rel=\"Ext.EventObject-property-W\" class=\"docClass\">Ext.EventObject.W</a>, // W for west\n        shift: true,\n        ctrl: false,\n        fn: function() {\n            var parentPanel = westPanel;\n            expand(parentPanel);\n        }\n    },\n    {\n        key: <a href=\"#!/api/Ext.EventObject-property-S\" rel=\"Ext.EventObject-property-S\" class=\"docClass\">Ext.EventObject.S</a>, // S for south\n        shift: true,\n        ctrl: false,\n        fn: function() {\n            var parentPanel = southPanel;\n            expand(parentPanel);\n        }\n    }\n]);\n</code></pre>\n\n<p>We use <a href=\"#!/api/Ext.EventObject\" rel=\"Ext.EventObject\" class=\"docClass\">Ext.EventObject.X</a> to make it obvious which key we're listening for, the rest should be clear from the example above. Then we write the <code>expand()</code> function underneath:</p>\n\n<pre><code>function expand(parentPanel) {\n    parentPanel.toggleCollapse();\n    parentPanel.on('expand', function(){\n        parentPanel.el.focus();\n    });\n    parentPanel.on('collapse', function(){\n        viewport.el.focus();\n    });\n}\n</code></pre>\n\n<p>This function toggles the collapsing of the panel and focuses on it if it's been expanded, or collapses it if it's already expanded, returning focus to the next level up, the <code>viewport</code>.</p>\n\n<p>Now that all of the code is in place, try expanding and collapsing the panels with a key press versus clicking on the small button that expands or collapses them.  It's much faster with the keyboard!</p>\n\n<p>Next, we'll go through a similar process with the Navigation, Settings and Information tabs on the West Panel. I've called them subPanels because they're children to the other <code>parentPanels</code> that we've seen already.</p>\n\n<pre><code>{\n    key: <a href=\"#!/api/Ext.EventObject-property-S\" rel=\"Ext.EventObject-property-S\" class=\"docClass\">Ext.EventObject.S</a>, // S for settings\n    ctrl: true,\n    fn: function() {\n        var parentPanel = westPanel;\n        var subPanel = settings;\n        expand(parentPanel, subPanel);\n    }\n},\n{\n    key: <a href=\"#!/api/Ext.EventObject-property-I\" rel=\"Ext.EventObject-property-I\" class=\"docClass\">Ext.EventObject.I</a>, // I for information\n    ctrl: true,\n    fn: function() {\n        var parentPanel = westPanel;\n        var subPanel = information;\n        expand(parentPanel, subPanel);\n    }\n},\n{\n    key: <a href=\"#!/api/Ext.EventObject-property-N\" rel=\"Ext.EventObject-property-N\" class=\"docClass\">Ext.EventObject.N</a>, // N for navigation\n    ctrl: true,\n    fn: function(){\n        var parentPanel = westPanel;\n        var subPanel = navigation;\n        expand(parentPanel, subPanel);\n    }\n}\n</code></pre>\n\n<p>We follow the same pattern as we've used before but added a variable called <code>subPanel</code>. Our <code>expand</code> function won't know what to do with these so we'll refactor it to act accordingly depending on whether <code>subPanel</code> is declared or not.</p>\n\n<pre><code>function expand(parentPanel, subPanel) {\n\n    if (subPanel) {\n        function subPanelExpand(subPanel) {\n            // set listener for expand function\n            subPanel.on('expand', function() {\n                setTimeout(function() { subPanel.focus(); }, 200);\n            });\n            // expand the subPanel\n            subPanel.expand();\n        }\n\n        if (parentPanel.collapsed) {\n            // enclosing panel is collapsed, open it\n            parentPanel.expand();\n            subPanelExpand(subPanel);\n        }\n        else if (!subPanel.collapsed) {\n            // subPanel is open and just needs focusing\n            subPanel.focus();\n        }\n        else {\n            // parentPanel isn't collapsed but subPanel is\n            subPanelExpand(subPanel);\n        }\n    }\n    else {\n        // no subPanel detected\n        parentPanel.toggleCollapse();\n        parentPanel.on('expand', function(){\n            parentPanel.el.focus();\n        });\n        parentPanel.on('collapse', function(){\n            viewport.el.focus();\n        });\n    }\n}\n</code></pre>\n\n<p>Despite <code>focus</code> being in the <code>expand</code> event listener, which is meant to fire <em>after</em> the panel has been expanded, it needs wrapping in a <code>setTimeout</code> because otherwise it focuses too early resulting in a focus frame smaller than the panel (that is, it focuses while it's expanding). Compensating 200 milliseconds gets around this; this problem isn't present with the <code>parentPanel</code>s.</p>\n\n<p>At this point you can open and close panels, as well as focus them, purely with the keyboard (e.g. shift+e or ctrl+s). Naturally, any function of Ext JS can be triggered by a key press leading to many possibilities for a more native-feeling application.</p>\n\n<p>There's one last object to add to our <code>KeyMap</code>, there are two tabs, one on the center panel and the other next to the 'Eye Data' tab. It would be useful to be able to close these as you would a tab in a browser with ctrl+w.</p>\n\n<pre><code>{\n    key: <a href=\"#!/api/Ext.EventObject-property-W\" rel=\"Ext.EventObject-property-W\" class=\"docClass\">Ext.EventObject.W</a>, // W to close\n    ctrl: true,\n    fn: function(){\n        var el = <a href=\"#!/api/Ext.FocusManager-property-focusedCmp\" rel=\"Ext.FocusManager-property-focusedCmp\" class=\"docClass\">Ext.FocusManager.focusedCmp</a>;\n        if (el.xtype === 'tab' &amp;&amp; el.closable) {\n            el.up().focus();\n            el.destroy();\n        }\n    },\n    scope: this\n}\n</code></pre>\n\n<p>We've configured which key presses we're listening for and get which component is currently focused with the Focus Manager's <a href=\"#!/api/Ext.FocusManager-property-focusedCmp\" rel=\"Ext.FocusManager-property-focusedCmp\" class=\"docClass\">focusedCmp</a> property. If the currently focused component is a tab and it's closable, then we set the focus to the parent panel and destroy the tab.</p>\n\n<h3>Fixing the Grid</h3>\n\n<p>You may have noticed that when we try to focus a row in the grid it isn't possible without the mouse. If you look in the console we get a clue as to why this is, it reports that \"pos is undefined\". The click event passes information on the record, including what its position in the grid is. However, using the FocusManager, it doesn't pass this information so we need to emulate it by passing an object that specifies the <code>row</code> and <code>column</code> properties. Do the following underneath the <code>viewport</code> variable:</p>\n\n<pre><code>var easttab = <a href=\"#!/api/Ext-method-getCmp\" rel=\"Ext-method-getCmp\" class=\"docClass\">Ext.getCmp</a>('easttab');\n\nvar gridMap = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.util.KeyMap\" rel=\"Ext.util.KeyMap\" class=\"docClass\">Ext.util.KeyMap</a>', 'eastPanel', [\n    {\n        key: '\\r', // Return key\n        fn: function() {\n            easttab.getSelectionModel().setCurrentPosition({row: 0, column: 1});\n        },\n        scope: 'eastPanel'\n    },\n    {\n        key: <a href=\"#!/api/Ext.EventObject-property-ESC\" rel=\"Ext.EventObject-property-ESC\" class=\"docClass\">Ext.EventObject.ESC</a>,\n        fn: function() {\n            easttab.el.focus();\n        },\n        scope: 'eastPanel'\n    }\n]);\n</code></pre>\n\n<p>Try this and you'll see that we can successfully enter and exit the grid using the keyboard. It's important that we specify the <code>scope</code> on these keys otherwise you won't be able to escape from the grid.</p>\n\n<h3>Toggling Keyboard Mapping</h3>\n\n<p>A useful feature of <code>KeyMap</code> is that it can easily be enabled or disabled. It could be that you don't want most users of your application to have a focus frame when they click on an element, so you could make a button (or another <code>KeyMap</code>) that enables this behavior.</p>\n\n<p>If you wanted to add a global key press that would turn on and off keyboard navigation you could do so with the following:</p>\n\n<pre><code>var initMap = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.util.KeyMap\" rel=\"Ext.util.KeyMap\" class=\"docClass\">Ext.util.KeyMap</a>', <a href=\"#!/api/Ext-method-getBody\" rel=\"Ext-method-getBody\" class=\"docClass\">Ext.getBody</a>(), {\n    key: <a href=\"#!/api/Ext.EventObject-property-T\" rel=\"Ext.EventObject-property-T\" class=\"docClass\">Ext.EventObject.T</a>, // T for toggle\n    shift: true,\n    fn: function(){\n        map.enabled ? map.disable() : map.enable();\n        <a href=\"#!/api/Ext.FocusManager-property-enabled\" rel=\"Ext.FocusManager-property-enabled\" class=\"docClass\">Ext.FocusManager.enabled</a> ? <a href=\"#!/api/Ext.FocusManager-event-disable\" rel=\"Ext.FocusManager-event-disable\" class=\"docClass\">Ext.FocusManager.disable</a>() : <a href=\"#!/api/Ext.FocusManager-event-enable\" rel=\"Ext.FocusManager-event-enable\" class=\"docClass\">Ext.FocusManager.enable</a>(true);\n    }\n});\n</code></pre>\n\n<p>We've created a new <code>KeyMap</code> that will turn off keyboard navigation with shift+t and turn it back on with the same. We aren't able to use the existing <code>KeyMap</code> because it would be turning itself off and wouldn't be able to be reinitialized.</p>\n\n<h2 id='keyboard_nav-section-5'>Conclusion</h2>\n\n<p>We've converted a complex series of panels that would have otherwise been inaccessible to use the keyboard. We've also encountered some examples where we've had to add some custom functionality on top of the Focus Manager.</p>\n\n<p>With <code>KeyMap</code>, we've learnt that we can jump to different Panels as well as invoke any functionality that we'd usually write with a keystroke. Finally, with <code>KeyNav</code> we've seen how easy it is to move around an application with arrow keys.</p>\n","title":"Keyboard Navigation"});