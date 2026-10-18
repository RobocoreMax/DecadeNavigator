const SVGNS = "http://www.w3.org/2000/svg";

const CLOCK_CX = 210;
const CLOCK_CY = 210;

const DAY_MS = 86400000;

function pad2(v) {
    return String(v).padStart(2, "0");
}

function floor1(v) {
    return Math.floor(v * 10) / 10;
}

function polar(
    cx,
    cy,
    radius,
    angle
) {

    const rad =
        (angle - 90)
        *
        Math.PI
        /
        180;

    return {

        x:
            cx +
            radius *
            Math.cos(rad),

        y:
            cy +
            radius *
            Math.sin(rad)

    };
}

function normalToFraction(
    hour,
    minute
) {

    return (
        (
            hour * 60
            +
            minute
        )
        /
        1440
    );
}

function fractionToNormal(
    fraction
) {

    let totalMinutes =
        Math.round(
            fraction * 1440
        );

    totalMinutes =
        (
            (
                totalMinutes % 1440
            )
            +
            1440
        )
        %
        1440;

    return {

        hour:
            Math.floor(
                totalMinutes / 60
            ),

        minute:
            totalMinutes % 60

    };
}

function decimalToFraction(
    cent,
    mil
) {

    return (
        (
            cent * 10
            +
            mil
        )
        /
        1000
    );
}

function fractionToDecimal(
    fraction
) {

    const total =
        fraction * 1000;

    return {

        cent:
            Math.floor(
                total / 10
            ),

        mil:
            Math.floor(
                total % 10
            )

    };
}

function currentDecimalTime() {

    const now =
        new Date();

    const elapsedMs =

        (
            (
                now.getHours()
                * 3600
            )
            +
            (
                now.getMinutes()
                * 60
            )
            +
            now.getSeconds()
        )

        *
        1000

        +

        now.getMilliseconds();

    const dayFraction =
        elapsedMs /
        DAY_MS;

    const totalTicks =
        dayFraction *
        100000;

    return {

        dayFraction,

        totalTicks,

        cent:
            Math.floor(
                totalTicks / 1000
            ),

        mil:
            Math.floor(
                (
                    totalTicks % 1000
                )
                /
                100
            ),

        tick:
            Math.floor(
                totalTicks %
                100
            )

    };
}

function buildClockFace() {

    const face =
        document.getElementById(
            "clockFace"
        );

    if (!face) {
        return;
    }

    face.innerHTML = "";

    for (
        let digit = 0;
        digit < 10;
        digit++
    ) {

        for (
            let tick = 0;
            tick < 10;
            tick++
        ) {

            const index =
                digit * 10 +
                tick;

            const angle =
                index * 3.6;

            const outer =
                polar(
                    CLOCK_CX,
                    CLOCK_CY,
                    180,
                    angle
                );

            let tickLength = 10;

            if (tick === 0) {
                tickLength = 30;
            }
            else if (tick === 5) {
                tickLength = 20;
            }
            const inner =
                polar(
                    CLOCK_CX,
                    CLOCK_CY,
                    180 - tickLength,
                    angle
                );

            const line =
                document.createElementNS(
                    SVGNS,
                    "line"
                );

            line.setAttribute(
                "x1",
                outer.x
            );

            line.setAttribute(
                "y1",
                outer.y
            );

            line.setAttribute(
                "x2",
                inner.x
            );

            line.setAttribute(
                "y2",
                inner.y
            );

            line.setAttribute(
                "stroke",
                "#94a3b8"
            );

            face.appendChild(
                line
            );

            if (tick === 0) {

                const pos =
                    polar(
                        CLOCK_CX,
                        CLOCK_CY,
                        130,
                        angle
                    );

                const label =
                    document.createElementNS(
                        SVGNS,
                        "text"
                    );

                label.setAttribute(
                    "x",
                    pos.x
                );

                label.setAttribute(
                    "y",
                    pos.y + 8
                );

                label.setAttribute(
                    "text-anchor",
                    "middle"
                );

                label.setAttribute(
                    "fill",
                    "white"
                );

                label.setAttribute(
                    "font-size",
                    "28"
                );

                label.textContent =
                    digit;

                face.appendChild(
                    label
                );
            }
        }
    }
}

function syncStartFromNormal() {

    const h =
        Number(
            startHour.value
        );

    const m =
        Number(
            startMinute.value
        );

    const fraction =
        normalToFraction(
            h,
            m
        );

    const decimal =
        fractionToDecimal(
            fraction
        );

    startCent.value =
        pad2(
            decimal.cent
        );

    startMil.value =
        decimal.mil;
}

function syncStartFromDecimal() {

    const cent =
        Number(
            startCent.value
        );

    const mil =
        Number(
            startMil.value
        );

    const fraction =
        decimalToFraction(
            cent,
            mil
        );

    const normal =
        fractionToNormal(
            fraction
        );

    startHour.value =
        pad2(
            normal.hour
        );

    startMinute.value =
        pad2(
            normal.minute
        );
}

function syncEndFromNormal() {

    const h =
        Number(
            endHour.value
        );

    const m =
        Number(
            endMinute.value
        );

    const fraction =
        normalToFraction(
            h,
            m
        );

    const decimal =
        fractionToDecimal(
            fraction
        );

    endCent.value =
        pad2(
            decimal.cent
        );

    endMil.value =
        decimal.mil;
}

function syncEndFromDecimal() {

    const cent =
        Number(
            endCent.value
        );

    const mil =
        Number(
            endMil.value
        );

    const fraction =
        decimalToFraction(
            cent,
            mil
        );

    const normal =
        fractionToNormal(
            fraction
        );

    endHour.value =
        pad2(
            normal.hour
        );

    endMinute.value =
        pad2(
            normal.minute
        );
}

function getStartFraction() {

    return normalToFraction(
        Number(
            startHour.value
        ),
        Number(
            startMinute.value
        )
    );
}

function getEndFraction() {

    let end =
        normalToFraction(
            Number(
                endHour.value
            ),
            Number(
                endMinute.value
            )
        );

    const start =
        getStartFraction();

    if (
        end <= start
    ) {

        end += 1;

        if (
            endNormalDayOffset
        ) {

            endNormalDayOffset
                .textContent =
                "+1";
        }

        if (
            endDecimalDayOffset
        ) {

            endDecimalDayOffset
                .textContent =
                "+1";
        }

    } else {

        if (
            endNormalDayOffset
        ) {

            endNormalDayOffset
                .textContent =
                "";
        }

        if (
            endDecimalDayOffset
        ) {

            endDecimalDayOffset
                .textContent =
                "";
        }
    }

    return end;
}

function updateActiveDay() {

    const now =
        new Date();

    const currentFraction =

        (
            (
                now.getHours()
                * 60
            )
            +
            now.getMinutes()
        )
        /
        1440;

    const startFraction =
        getStartFraction();

    const endFraction =
        getEndFraction();

    const duration =
        endFraction -
        startFraction;

    let activeNow =
        currentFraction;

    if (
        activeNow <
        startFraction
    ) {

        activeNow += 1;
    }

    const position =

        (
            activeNow -
            startFraction
        )
        /
        duration;

    const rawPercent =
        position * 100;

    let state =
        "ACTIVE";

    if (
        rawPercent < 0
    ) {

        state =
            "EARLY";

    } else if (
        rawPercent > 100
    ) {

        state =
            "LATE";
    }

    const magnitude =
        floor1(
            Math.abs(
                rawPercent
            )
        );

    activePercent.textContent =

        (
            state === "EARLY"
                ? "-"
                : ""
        )

        +

        magnitude
            .toFixed(1)

        +

        "%";

    activeState.textContent =
        state;

    activeState.className =
        "active-state state-" +
        state.toLowerCase();

    const fill =
        document.getElementById(
            "activeProgressFill"
        );

    if (fill) {

        fill.className =
            "progress-fill " +
            state.toLowerCase();

        fill.style.width =
            Math.min(
                100,
                magnitude
            ) + "%";
    }

    if (
        activeDescription
    ) {

        if (
            state === "ACTIVE"
        ) {

            activeDescription.textContent =
                "Active Day";

        } else if (
            state === "LATE"
        ) {

            activeDescription.textContent =
                "Late to bed by";

        } else {

            activeDescription.textContent =
                "Active day begins in";
        }
    }

    const deltaFraction =

        state === "ACTIVE"

            ? (
                endFraction -
                activeNow
            )

            : (
                state === "LATE"

                    ? (
                        activeNow -
                        endFraction
                    )

                    : (
                        startFraction -
                        currentFraction
                    )
            );

    const normal =
        fractionToNormal(
            Math.abs(
                deltaFraction
            )
        );

    const decimal =
        fractionToDecimal(
            Math.abs(
                deltaFraction
            )
        );

    if (
        activeDeltaNormal
    ) {

        activeDeltaNormal.textContent =

            pad2(
                normal.hour
            )

            +

            ":"

            +

            pad2(
                normal.minute
            );
    }

    if (
        activeDeltaDecimal
    ) {

        activeDeltaDecimal.textContent =

            pad2(
                decimal.cent
            )

            +

            ":"

            +

            decimal.mil;
    }
}

function updateDayProgress(
    dayFraction
) {

    const percent =
        floor1(
            dayFraction * 100
        );

    const fill =
        document.getElementById(
            "dayProgressFill"
        );

    if (fill) {

        fill.style.width =
            percent + "%";
    }

    const text =
        document.getElementById(
            "dayProgressText"
        );

    if (text) {

        text.textContent =
            percent.toFixed(1)
            +
            "% day complete";
    }
}

function updateClock() {

    const dec =
        currentDecimalTime();

    const now =
        new Date();

    decMain.textContent =

        pad2(
            dec.cent
        )

        +

        ":"

        +

        dec.mil;

    decTicks.textContent =

        ":"

        +

        pad2(
            dec.tick
        );

    gregMain.textContent =

        pad2(
            now.getHours()
        )

        +

        ":"

        +

        pad2(
            now.getMinutes()
        );

    gregSeconds.textContent =

        ":"

        +

        pad2(
            now.getSeconds()
        );

    updateDayProgress(
        dec.dayFraction
    );

    blockHand.setAttribute(

        "transform",

        `rotate(${dec.totalTicks *
        0.0036
        },210,210)`
    );

    milleHand.setAttribute(

        "transform",

        `rotate(${(
            dec.totalTicks /
            100
        )
        *
        3.6
        },210,210)`
    );

    tickHand.setAttribute(

        "transform",

        `rotate(${(
            dec.totalTicks %
            100
        )
        *
        3.6
        },210,210)`
    );

    updateActiveDay();
}

    document.addEventListener(

        "DOMContentLoaded",

        () => {

            buildClockFace();

            syncStartFromNormal();

            syncEndFromNormal();

            startHour.addEventListener(
                "change",
                syncStartFromNormal
            );

            startMinute.addEventListener(
                "change",
                syncStartFromNormal
            );

            startCent.addEventListener(
                "change",
                syncStartFromDecimal
            );

            startMil.addEventListener(
                "change",
                syncStartFromDecimal
            );

            endHour.addEventListener(
                "change",
                syncEndFromNormal
            );

            endMinute.addEventListener(
                "change",
                syncEndFromNormal
            );

            endCent.addEventListener(
                "change",
                syncEndFromDecimal
            );

            endMil.addEventListener(
                "change",
                syncEndFromDecimal
            );

            updateClock();

            setInterval(
                updateClock,
                50
            );
        }
    );
