
const FLAG_NAMESPACE = 'ymg-pathfinder';
const ELDRITCH_DISSONANCE =   'eldritch-dissonance';
const ELDRITCH_DISSONANCE_OVERRIDE =   'eldritch-dissonance_override';

Hooks.once('init', () => {

    if (!game.modules.get('lib-wrapper')?.active) {
        return ui.notifications.error("Eldritch Dissonance requires the 'libWrapper' module. Please install and activate it.");
    }

    // Wrap the getChargeCost method for spells
    libWrapper.register('ymg-pathfinder', 'pf1.components.ItemAction.prototype.getChargeCost', function (wrapped, ...args) {
        // Only intercept for spells
        if (this.item.type !== 'spell') return wrapped(...args);

        // Use custom logic to calculate spell cost
        return getSpellPointsCost(this.actor, this.item);
    }, 'MIXED');

    libWrapper.register('ymg-pathfinder', 'pf1.actionUse.ActionUse.prototype.alterRollData', function (wrapped, ...args) {
        if (this.item.type === 'spell' && args[0].bypassEldritchDissonance) {
            foundry.utils.setProperty(this.item, "bypassEldritchDissonance", true);
        }

        return wrapped(...args);
    }, 'MIXED');

});

// Hook that runs when Foundry is ready
Hooks.on('ready',  async () => {
    console.log("Eldritch Dissonance Module Loaded");

    if (typeof pf1.components.ItemAction.prototype.getChargeCost === 'function') {
        console.log("poopi getChargeCost exists on Item prototype");
    } else {
        console.log("poopi getChargeCost does NOT exist on Item prototype");
    }

    // Initialize Eldritch Dissonance data for all existing actors
    for (const actor of game.actors) {
        await initializeEldritchDissonance(actor);
    }

    // // Listen for spell casting events
    // Hooks.on("pf1CreateActionUse", async (actionUse)  => {
    //     if (actionUse.item.type !== 'spell')
    //         return true
    //     return handlePrecastSpell(actionUse);
    // });

    Hooks.on('renderActorSheet', async (app, html, data) => {
        // Select all spell entries within the actor sheet
        html.find('ol.item-list[data-type="spell"] li.item.flexrow').each((index, element) => {
            const spellId = $(element).data('item-id'); // Get the spell ID from the 'data-item-id' attribute
            if (getCastSpells(app.actor, spellId) > 0) {
                // const resetButton = $(`<button type="button" class="reset-dissonance">Reset Dissonance</button>`);
                const resetButton = $(`<button type="button" class="reset-dissonance">Reset Dissonance</button>`).css({
                    'font-size': '0.75em',     // Smaller font size
                    'margin-left': '5px',      // Small margin to separate from spell name
                    'padding': '2px 5px',      // Adjust padding to reduce button size
                    'max-width': '100px',      // Limit button width to prevent overlap
                    'flex-shrink': 0,          // Prevent the button from shrinking too much
                });
                // Append the reset button inside the .item-name div, at the end
                $(element).find('.item-name.rollable').append(resetButton);

                // Bind the click event to the reset button
                resetButton.on('click', async () => {
                    await resetEldritchDissonance(app.actor, spellId);
                });
            }
        });
    });

    Hooks.on("pf1PreActionUse", async (actionUse)  => {
        if (actionUse.item.type !== 'spell')
            return true
        return await handleSpellCast(actionUse.actor, actionUse.item);
    });

    // Reset the spell list when the actor rests
    Hooks.on('pf1ActorRest', async (actor, restData) =>  {
        await resetSpellList(actor);
    });

    Hooks.on('renderItemSheet', (app, html, data) => {
        // Only target spells
        if (app.document.type !== "spell") return;

        // Add checkbox for Eldritch Dissonance override
        const eldritchDissonanceCheckbox = `
        <div class="form-group">
          <label>Eldritch Dissonance Override:</label>
          <input type="checkbox" name="flags.${FLAG_NAMESPACE}.${ELDRITCH_DISSONANCE_OVERRIDE}" ${data.document.flags[FLAG_NAMESPACE]?.[ELDRITCH_DISSONANCE_OVERRIDE] ? 'checked' : ''}>
        </div>`;

        // Inject the checkbox into the spell settings form
        html.find('.tab[data-tab="details"]').append(eldritchDissonanceCheckbox);
    });

    Hooks.on('renderAttackDialog', (app, html, data) => {
        if (data.action.item.type !== 'spell') return;

        let spellCost;
        if (data.flags.bypassEldritchDissonance || false) {
            spellCost = data.action.item.getDefaultChargeCost()

        }
        else {
            spellCost = data.action.getChargeCost();
        }

        // Create a new form group for the spell cost
        const costElement = $(`
          <div class="form-group">
            <label>Spell Cost</label>
            <div class="form-fields">
              <input type="text" value="${spellCost} SP" disabled>
            </div>
          </div>
        `);
        html.find("button[name='attack_full']").closest(".form-group").before(costElement);

        current = getCastSpells(data.action.actor, data.action.item._id);
        if (current > 0) {
            const bypassCheckbox = $(`
              <div class="form-group">
                <label>Bypass Eldritch Dissonance</label>
                <div class="form-fields">
                  <input type="checkbox" name="bypassEldritchDissonance">
                </div>
              </div>
            `);
            costElement.after(bypassCheckbox);
            const isBypassSet = app.flags?.bypassEldritchDissonance || false;
            html.find(`input[type="checkbox"][name="bypassEldritchDissonance"]`).prop("checked", isBypassSet);
            html.find(`input[type="checkbox"][name="bypassEldritchDissonance"]`).on("change", app._onToggleFlag.bind(app));
        }
        
        app.setPosition({ height: 'auto' }); // Adjusts height automatically based on content
    });
});


async function initializeEldritchDissonance(actor, force = false) {
    const hasFlag = actor.getFlag(FLAG_NAMESPACE, ELDRITCH_DISSONANCE) !== undefined;
    if (force || !hasFlag) {
        await actor.unsetFlag(FLAG_NAMESPACE, ELDRITCH_DISSONANCE);
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
        await actor.setFlag(FLAG_NAMESPACE, ELDRITCH_DISSONANCE, {"dummy": 0});
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
    }
    await actor.update({});
}

function handlePrecastSpell(actionUse) {
    if (!actionUse) return true;

    spellCost = getSpellPointsCost(actionUse.actor, actionUse.item);
    if (spellCost < 0) {
        return true;
    }

    if (actionUse.item.spellbook.spellPoints.value < spellCost) {
        ui.notifications.warn(`${actor.name} does not have enough spell points to cast ${spellName}. Required: ${spellCost}, Available: ${currentSpellPoints}`);
        return false;
    }

    actionUse.action.data.uses.spellPointCost = spellCost.toString();
    return true;
}

function getCastSpells(actor, spellId) {
    if (!actor) return -1;
    let current = actor.getFlag(FLAG_NAMESPACE, ELDRITCH_DISSONANCE);    
    const castSpells = current ? duplicate(current) : {};
    return castSpells[spellId] || 0;
}

function getSpellPointsCost(actor, spell) {
    if (!actor || !spell) return -1;

    const spellLevel = spell.spellLevel;
    if (spellLevel === 0) {
        return 0;
    }

    const spellName = spell.name;
    const isOverride = spell.getFlag(FLAG_NAMESPACE, ELDRITCH_DISSONANCE_OVERRIDE) || spell.bypassEldritchDissonance;
    if (isOverride) {
        console.log("Eldritch: %s | cost: override", spellName);
        return spellLevel + 1;
    }

    const casterType = spell.spellbook.spellPreparationMode
    let current = actor.getFlag(FLAG_NAMESPACE, ELDRITCH_DISSONANCE)
    let castSpells = current ? duplicate(current) : {};

    const spellId = spell._id;
    let spellCount = castSpells[spellId] || 0;
    let additionalCost = (casterType === 'prepared') ? spellLevel * spellCount : spellCount;

    let spellCost = 1 + spellLevel + additionalCost;

    console.log("Eldritch: %s | cost: %d", spellName, spellCost);
    return spellCost;
}

/**
 * Handles the spell casting logic, calculating spell point costs and updating the actor's data.
 * @param {Actor} actor - The actor casting the spell.
 * @param {Object} spell - The spell being cast.
 */
async function handleSpellCast(actor, spell) {

    if (!actor || !spell) return true;
    const spellLevel = spell.spellLevel;
    if (spellLevel === 0) {
        return true;
    }

    isOverride = spell.getFlag(FLAG_NAMESPACE, ELDRITCH_DISSONANCE_OVERRIDE)
    if (isOverride) {
        return true;
    }

    foundry.utils.setProperty(spell, "bypassEldritchDissonance", false);

    const spellId = spell._id;
    let current = await actor.getFlag(FLAG_NAMESPACE, ELDRITCH_DISSONANCE);
    let castSpells = current ? duplicate(current) : {};
    let spellCount = castSpells[spellId] || 0;
    castSpells[spellId] = spellCount + 1;
    await actor.setFlag(FLAG_NAMESPACE, ELDRITCH_DISSONANCE, castSpells);
    return true;
}

/**
 * Resets the list of cast spells for an actor, typically called during a rest.
 * @param {Actor} actor - The actor whose spell list is to be reset.
 */
async function resetSpellList(actor) {
    if (!actor) return;
    await initializeEldritchDissonance(actor, true);
    ui.notifications.info(`${actor.name}'s list of cast spells has been reset.`);
}

async function resetEldritchDissonance(actor, spellId) {
    // Get the current Eldritch Dissonance data for the actor
    const current = await actor.getFlag(FLAG_NAMESPACE, ELDRITCH_DISSONANCE);
    let castSpells = current ? duplicate(current) : {};

    // Get the spell by its ID
    const spell = actor.items.get(spellId);

    if (spell) {
        const spellName = spell.name;

        // Reset the spell's dissonance count
        if (castSpells[spellId] !== undefined) {
            delete castSpells[spellId];

            await initializeEldritchDissonance(actor, true);
            await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay

            if (Object.keys(castSpells).length > 0) {
                await actor.setFlag(FLAG_NAMESPACE, ELDRITCH_DISSONANCE, castSpells);
                await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
            }
            ui.notifications.info(`${spellName}'s Eldritch Dissonance count has been reset.`);
            actor.sheet.render(true);
        } else {
            ui.notifications.warn(`${spellName} has no Eldritch Dissonance to reset.`);
        }
    }
}