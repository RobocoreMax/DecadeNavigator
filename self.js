/*
Decade Navigator

self.js

v1
- Created from Beta 4 specification
- SELF preview card
- Personal sprint placeholder engine
- Age-cycle placeholder engine
- Ready for future expansion
*/

(function () {

    /* ----------------------------- */
    /* Configuration                 */
    /* ----------------------------- */

    const SELF_MODEL = {

        code: "58q0",

        sprintNumber: 161,
        sprintTotal: 180,

        sprintDay: 22,
        sprintDayTotal: 91,

        pathStart: "37-5",
        pathEnd: "47-4",

        progressPercent: 24.7
    };

    /* ----------------------------- */
    /* Rendering                     */
    /* ----------------------------- */

    function renderSelfCard() {

        const container =
            document.getElementById(
                "selfContent"
            );

        if (!container) {
            return;
        }

        container.innerHTML = `
            <div class="self-code">
                ${SELF_MODEL.code}
            </div>

            <div>
                Sprint
                ${SELF_MODEL.sprintNumber}
                /
                ${SELF_MODEL.sprintTotal}
            </div>

            <div>
                Sprint Day
                ${SELF_MODEL.sprintDay}
                /
                ${SELF_MODEL.sprintDayTotal}
            </div>

            <div class="muted">
                ${SELF_MODEL.pathStart}
                →
                ${SELF_MODEL.pathEnd}
            </div>

            <div style="
                margin-top:16px;
                width:100%;
                height:14px;
                background:#334155;
                border-radius:10px;
                overflow:hidden;
            ">
                <div style="
                    width:${SELF_MODEL.progressPercent}%;
                    height:100%;
                    background:#06b6d4;
                ">
                </div>
            </div>

            <div style="
                margin-top:8px;
            ">
                ${SELF_MODEL.progressPercent.toFixed(1)}%
            </div>
        `;
    }

    /* ----------------------------- */
    /* Future Hooks                  */
    /* ----------------------------- */

    function updateSelf() {

        /*
            Future ideas:

            - age cycles
            - decade cycles
            - quarterly themes
            - sprint automation
            - personal goals
            - habit metrics
            - life milestones
        */

        renderSelfCard();
    }

    /* ----------------------------- */
    /* Startup                       */
    /* ----------------------------- */

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            updateSelf();

            /*
                Placeholder refresh.
                Real logic will
                eventually drive updates.
            */

            setInterval(
                updateSelf,
                60000
            );
        }
    );

})();