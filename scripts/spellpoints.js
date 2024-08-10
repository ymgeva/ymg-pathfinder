
const FLAG_NAMESPACE = 'ymg-pathfinder';
const ELDRITCH_DISSONANCE =   'eldritch-dissonance';
const ELDRITCH_DISSONANCE_OVERRIDE =   'eldritch-dissonance_override';

// Hook that runs when Foundry is ready
Hooks.on('ready',  () => {
    console.log("Eldritch Dissonance Module Loaded");

    // Initialize Eldritch Dissonance data for all existing actors
    game.actors.forEach(actor => {
        initializeEldritchDissonance(actor);
    });

    // Listen for spell casting events
    Hooks.on("pf1CreateActionUse", async (actionUse)  => {
        if (actionUse.item.type !== 'spell')
            return true
        return await handlePrecastSpell(actionUse);
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

        const spellCost = data.action.getChargeCost();

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
        app.setPosition({ height: 'auto' }); // Adjusts height automatically based on content
    });

});

async function initializeEldritchDissonance(actor) {
    if (actor.type !== 'character') return;
    const hasFlag = actor.getFlag(FLAG_NAMESPACE, ELDRITCH_DISSONANCE) !== undefined;
    if (!hasFlag) {
        actor.setFlag(FLAG_NAMESPACE, ELDRITCH_DISSONANCE, {});
    }
}

async function handlePrecastSpell(actionUse) {
    if (!actionUse) return true;

    await initializeEldritchDissonance(actionUse.actor);

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

function getSpellPointsCost(actor, spell) {
    if (!actor || !spell) return -1;

    const spellLevel = spell.spellLevel;
    if (spellLevel === 0) {
        return 0;
    }

    const spellName = spell.name;
    const isOverride = spell.getFlag(FLAG_NAMESPACE, ELDRITCH_DISSONANCE_OVERRIDE) || false;
    if (isOverride) {
        console.log("Eldritch: %s | cost: override", spellName);
        return -1;
    }

    const casterType = spell.spellbook.spellPreparationMode
    let castSpells = duplicate(actor.getFlag(FLAG_NAMESPACE, ELDRITCH_DISSONANCE)) || {};

    let spellCount = castSpells[spellName] || 0;
    let additionalCost = (casterType === 'prepared') ? spellLevel * spellCount : spellCount;

    let spellCost = 1 + spellLevel + additionalCost;
    spell.system.uses.spellPointCost

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

    const spellName = spell.name;
    let castSpells = duplicate(actor.getFlag(FLAG_NAMESPACE, ELDRITCH_DISSONANCE)) || {};
    let spellCount = castSpells[spellName] || 0;
    castSpells[spellName] = spellCount + 1;
    await actor.setFlag(FLAG_NAMESPACE, ELDRITCH_DISSONANCE, castSpells);
    return true;
}

/**
 * Resets the list of cast spells for an actor, typically called during a rest.
 * @param {Actor} actor - The actor whose spell list is to be reset.
 */
async function resetSpellList(actor) {
    if (!actor) return;
    await actor.unsetFlag(FLAG_NAMESPACE, ELDRITCH_DISSONANCE);
    ui.notifications.info(`${actor.name}'s list of cast spells has been reset.`);
}

