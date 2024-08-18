
const CONSOLIDATED_SKILLS_NAMES = {
    cs_acr: "Acrobatics",
    cs_ath: "Athletics",
    cs_fin: "Finesse",
    cs_inf: "Influence",
    cs_nat: "Nature",
    cs_per: "Perception",
    cs_prf: "Performance",
    cs_reg: "Religion",
    cs_soc: "Society",
    cs_spl: "Spellcraft",
    cs_ste: "Stealth",
    cs_sur: "Survival",
    lin: "Linguistics",
    cs_craft: "Craft",
};

const CONSOLIDATED_SKILLS_CONFIG = {
    cs_acr: "YMGPathfinder.CSSkillAcr",
    cs_ath: "YMGPathfinder.CSSkillAth",
    cs_fin: "YMGPathfinder.CSSkillFin",
    cs_inf: "YMGPathfinder.CSSkillInf",
    cs_nat: "YMGPathfinder.CSSkillNat",
    cs_per: "YMGPathfinder.CSSkillPer",
    cs_prf: "YMGPathfinder.CSSkillPrf",
    cs_reg: "YMGPathfinder.CSSkillReg",
    cs_soc: "YMGPathfinder.CSSkillSoc",
    cs_spl: "YMGPathfinder.CSSkillSpl",
    cs_ste: "YMGPathfinder.CSSkillSte",
    cs_sur: "YMGPathfinder.CSSkillSur",
    lin: "YMGPathfinder.CSSkillLin",
    cs_craft: "YMGPathfinder.CSSkillCraft",
};

const CLASS_SKILLS = {
    "Alchemist": {
        "skills": ["cs_fin", "cs_spl", "cs_sur"],
        "points": 2
    },
    "Arcanist": {
        "skills": ["cs_reg", "cs_soc", "cs_spl"],
        "points": 1
    },
    "Barbarian": {
        "skills": ["cs_ath", "cs_nat"],
        "points": 1
    },
    "Bard": {
        "skills": ["cs_inf", "cs_per", "cs_prf", "cs_soc", "cs_spl"],
        "points": 3
    },
    "Bloodrager": {
        "skills": ["cs_ath", "cs_spl"],
        "points": 2
    },
    "Brawler": {
        "skills": ["cs_acr", "cs_ath", "cs_per"],
        "points": 2
    },
    "Cavalier": {
        "skills": ["cs_acr", "cs_ath", "cs_nat"],
        "points": 2
    },
    "Cleric": {
        "skills": ["cs_reg", "cs_spl", "cs_sur"],
        "points": 1
    },
    "Druid": {
        "skills": ["cs_ath", "cs_nat", "cs_sur"],
        "points": 2
    },
    "Fighter": {
        "skills": ["cs_acr", "cs_ath"],
        "points": 1
    },
    "Gunslinger": {
        "skills": ["cs_ath", "cs_sur"],
        "points": 2
    },
    "Hunter": {
        "skills": ["cs_ath", "cs_nat", "cs_per", "cs_ste"],
        "points": 3
    },
    "Inquisitor": {
        "skills": ["cs_inf", "cs_per", "cs_spl", "cs_ste", "cs_sur"],
        "points": 3
    },
    "Investigator": {
        "skills": ["cs_acr", "cs_fin", "cs_inf", "cs_per", "cs_soc", "cs_spl"],
        "points": 3
    },
    "Magus": {
        "skills": ["cs_ath", "cs_spl"],
        "points": 1
    },
    "Monk": {
        "skills": ["cs_acr", "cs_ath", "cs_per"],
        "points": 2
    },
    "Oracle": {
        "skills": ["cs_reg"],
        "points": 2
    },
    "Paladin": {
        "skills": ["cs_reg", "cs_sur"],
        "points": 1
    },
    "Ranger": {
        "skills": ["cs_ath", "cs_nat", "cs_per", "cs_ste", "cs_sur"],
        "points": 3
    },
    "Rogue": {
        "skills": ["cs_acr", "cs_fin", "cs_inf", "cs_per", "cs_soc", "cs_ste"],
        "points": 4
    },
    "Shaman": {
        "skills": ["cs_nat", "cs_reg", "cs_sur"],
        "points": 2
    },
    "Skald": {
        "skills": ["cs_inf", "cs_prf", "cs_soc", "cs_spl"],
        "points": 2
    },
    "Slayer": {
        "skills": ["cs_ath", "cs_inf", "cs_ste", "cs_sur"],
        "points": 3
    },
    "Sorcerer": {
        "skills": ["cs_inf", "cs_spl"],
        "points": 1
    },
    "Summoner": {
        "skills": ["cs_reg", "cs_spl"],
        "points": 1
    },
    "Swashbuckler": {
        "skills": ["cs_acr", "cs_ath", "cs_inf", "cs_per"],
        "points": 2
    },
    "Warpriest": {
        "skills": ["cs_ath", "cs_reg", "cs_sur"],
        "points": 1
    },
    "Witch": {
        "skills": ["cs_nat", "cs_reg", "cs_spl"],
        "points": 1
    },
    "Wizard": {
        "skills": ["cs_reg", "cs_soc", "cs_spl"],
        "points": 1
    }
}

const NEW_TO_OLD_SKILL = {
    "cs_acr": ["acr", "esc", "fly", "rid"],
    "cs_ath": ["acr", "clm", "swm"],
    "cs_fin": ["dev", "slt"],
    "cs_inf": ["blf", "dip", "int"],
    "cs_nat": ["han", "kdu", "kge", "kna"],
    "cs_per": ["per", "sen"],
    "cs_prf": ["dis", "prf"],
    "cs_reg": ["kpl", "kre"],
    "cs_soc": ["apr", "khi", "klo", "kno", "lin", "lor"],
    "cs_spl": ["kar", "spl", "umd"],
    "cs_ste": ["ste"],
    "cs_sur": ["hea", "sur"],
    "lin": ["lin"],
    "cs_craft": ["art", "ken", "crf", "pro"],
}

const CONSOLIDATED_SKILLS = {
    "cs_acr": {
        "ability": "dex",
        "rt": false,
        "acp": true,
        "rank": 0
    },
    "cs_ath": {
        "ability": "str",
        "rt": false,
        "acp": true,
        "rank": 0
    },
    "cs_fin": {
        "ability": "dex",
        "rt": true,
        "acp": true,
        "rank": 0
    },
    "cs_inf": {
        "ability": "cha",
        "rt": false,
        "acp": false,
        "rank": 0
    },
    "cs_nat": {
        "ability": "int",
        "rt": true,
        "acp": false,
        "rank": 0
    },
    "cs_per": {
        "ability": "wis",
        "rt": false,
        "acp": false,
        "rank": 0
    },
    "cs_prf": {
        "ability": "cha",
        "rt": false,
        "acp": false,
        "rank": 0
    },
    "cs_reg": {
        "ability": "int",
        "rt": true,
        "acp": false,
        "rank": 0
    },
    "cs_soc": {
        "ability": "int",
        "rt": true,
        "acp": false,
        "rank": 0
    },
    "cs_spl": {
        "ability": "int",
        "rt": true,
        "acp": false,
        "rank": 0
    },
    "cs_ste": {
        "ability": "dex",
        "rt": false,
        "acp": true,
        "rank": 0
    },
    "cs_sur": {
        "ability": "wis",
        "rt": false,
        "acp": false,
        "rank": 0
    },
    "lin": {
        "ability": "int",
        "rt": true,
        "acp": false,
        "rank": 0
    },
    "cs_craft": {
        "ability": "int",
        "rt": true,
        "acp": false,
        "rank": 0
    },
}

const CONSOLIDATED_SKILLS_FLAG = 'consolidated_skills';
const CONSOLIDATED_SKILLS_CLASS_FLAG = 'consolidated_skills_class';

Hooks.once('init', async function() {
    CONFIG.PF1.skills = CONSOLIDATED_SKILLS_CONFIG;

    libWrapper.register('ymg-pathfinder', 'pf1.documents.actor.ActorPF.prototype.getSkillInfo', function (wrapped, ...args) {
        let skillKey = oldToNew(args[0]);
        skill = getConsolidatedSkillInfo(skillKey, this);
        return skill;
    }, 'MIXED');
});

function oldToNew(skillKey) {
    if (NEW_TO_OLD_SKILL.hasOwnProperty(skillKey)) {
        return skillKey;
    }
    for (let [key, skills] of Object.entries(NEW_TO_OLD_SKILL)) {
        if (skills.includes(skillKey)) {
            return key;
        }
    }
    console.log(`poopi Unknown skill key: ${skillKey}`);
    return skillKey;
}

function getConsolidatedSkillInfo(skillKey, actor) {
    skill = duplicate(CONSOLIDATED_SKILLS[skillKey]);
    skill.name = CONSOLIDATED_SKILLS_NAMES[skillKey];
    skill.cs = isClassSkill(skillKey, actor);
    skill.mod = actor.system.abilities[skill.ability].mod;
    return skill;
}

function isClassSkill(skill, actor) {
    let isClassSkill = false;
    for (let item of actor.items) {
        if (item.type === 'class') {
            if (item.system.classSkills[skill]) {
                isClassSkill = true;
            }
        }
    }
    return isClassSkill;
}

function migrateActorSkill(actor) {
    if (actor.type !== 'character') return;

    let newSkills = duplicate(CONSOLIDATED_SKILLS);
    const oldSkills = actor.system.skills;
    for (let [key, skill] of Object.entries(NEW_TO_OLD_SKILL)) {
        if (oldSkills.hasOwnProperty(key)) {
            newSkills[key].rank = oldSkills[key].rank;
            continue;
        }

        let rank = 0;
        for (let oldSkill of skill) {
            if (!oldSkills.hasOwnProperty(oldSkill)) {
                continue;
            }
            rank = Math.max(rank, actor.system.skills[oldSkill].rank);
        }
        newSkills[key].rank = rank;
    }
    for (let skillKey in newSkills) {
        let skill = newSkills[skillKey];
        skill.cs = isClassSkill(skillKey, actor);
        skill.mod = actor.system.abilities[skill.ability].mod;
    }

    actor.setFlag(FLAG_NAMESPACE, CONSOLIDATED_SKILLS_FLAG, newSkills);
    return newSkills;
}

function needClassSkillsMigrate(item) {
    for (let skillKey in CONSOLIDATED_SKILLS) {
        if (!item.system.classSkills.hasOwnProperty(skillKey)) {
            return true;
        }
    }
    return false;
}

function migrateClassSkillsIfNeeded(actor) {
    for (let item of actor.items) {
        if (item.type !== 'class') {
            continue;
        }
        if (!needClassSkillsMigrate(item)) {
            continue;
        }


        const className = item.name;
        const classConfig = CLASS_SKILLS[className];

        let newClassSkills = {};
        for (let skillKey in CONSOLIDATED_SKILLS) {
            newClassSkills[skillKey] = classConfig.skills.includes(skillKey);
        }
        item.system.classSkills = newClassSkills;
        item.system.skillsPerLevel = classConfig.points;
    }
}

Hooks.on('pf1PrepareBaseActorData', (actor) => {
    console.log('pf1PrepareBaseActorData poopi');
    let skills = actor.getFlag(FLAG_NAMESPACE, CONSOLIDATED_SKILLS_FLAG);
    if (skills === undefined) {
        skills = migrateActorSkill(actor);
    }
    skills = migrateActorSkill(actor);
    actor.system.skills = skills;

});

Hooks.on('pf1PrepareDerivedActorData', (actor) => {
    migrateClassSkillsIfNeeded(actor);
    console.log('pf1PrepareDerivedActorData poopi');
});