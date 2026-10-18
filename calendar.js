/*
Decade Navigator

calendar.js

v2 (4.0 Alpha 1)

Changes from v1

- Added ISO Gregorian dates
- Added proper decimal weekday model
- Split metadata into two lines
- Continuous year progress
- Floored percentages
- Decimal/Gregorian side-by-side display
*/

(function () {

    /* ================================ */
    /* Utilities                        */
    /* ================================ */

    function floor1(v) {
        return Math.floor(v * 10) / 10;
    }

    function dayOfYear(date) {

        const start =
            new Date(
                date.getFullYear(),
                0,
                0
            );

        return Math.floor(
            (date - start)
            / 86400000
        );
    }

    function isLeapYear(year) {

        return (
            year % 4 === 0 &&
            (
                year % 100 !== 0 ||
                year % 400 === 0
            )
        );
    }

    function decimalTime(date) {

        const ms =
            (
                (
                    date.getHours() * 3600
                ) +
                (
                    date.getMinutes() * 60
                ) +
                date.getSeconds()
            ) * 1000 +
            date.getMilliseconds();

        const frac =
            ms / 86400000;

        const total =
            frac * 100000;

        return {

            frac,

            cent:
                Math.floor(
                    total / 1000
                ),

            mil:
                Math.floor(
                    (
                        total % 1000
                    ) / 100
                ),

            tick:
                Math.floor(
                    total % 100
                )
        };
    }

    function pad2(v) {
        return String(v)
            .padStart(2, "0");
    }

    /* ================================ */
    /* Decimal Calendar                 */
    /* ================================ */

    const decadeDayNames = [
        "Воскресенье",
        "Понедельник",
        "Вторник",
        "Третийник",
        "Четверг",
        "Среда",
        "Шестёрник",
        "Семёрник",
        "Восьмёрник",
        "Суббота"
    ];

    function decimalCalendarPosition(date) {

        const ordinal =
            dayOfYear(date);

        const quartal =
            Math.floor(
                (ordinal - 1)
                / 91
            ) + 1;

        const dayInsideQuartal =
            (
                (ordinal - 1)
                % 91
            ) + 1;

        const week =
            Math.floor(
                (dayInsideQuartal - 1)
                / 10
            ) + 1;

        const dayOfDecade =
            (
                (dayInsideQuartal - 1)
                % 10
            );

        const weekdayName =
            decadeDayNames[
                dayOfDecade
            ];

        return {

            ordinal,

            quartal,

            week,

            dayOfDecade,

            weekdayName
        };
    }

    /* ================================ */
    /* Year Card                        */
    /* ================================ */

    function updateYearCard() {

        const now =
            new Date();

        const dt =
            decimalTime(now);

        const pos =
            decimalCalendarPosition(
                now
            );

        /* ---------------------------- */
        /* Decimal Column              */
        /* ---------------------------- */

        const decimalStamp =

            `${now.getFullYear()}-` +
            `${pos.quartal}${pos.week}-` +
            `${pos.dayOfDecade}`;

        const decimalDateEl =
            document.getElementById(
                "decimalDate"
            );

        if (decimalDateEl) {

            decimalDateEl.innerHTML =

                `${decimalStamp}
                <span class="muted">
                .${pad2(dt.cent)}
                :${dt.mil}
                :${pad2(dt.tick)}
                </span>`;
        }

        const decimalMetaEl =
            document.getElementById(
                "decimalMeta"
            );

        if (decimalMetaEl) {

            decimalMetaEl.innerHTML =

                `
                Ordinal Day
                ${pos.ordinal}
                • Quartal
                ${pos.quartal}
                • Week
                ${pos.week}

                <br>

                Day
                ${pos.dayOfDecade}
                •
                ${pos.weekdayName}
                `;
        }

        /* ---------------------------- */
        /* Gregorian Column            */
        /* ---------------------------- */

        const isoDate =

            `${now.getFullYear()}-` +
            `${pad2(
                now.getMonth() + 1
            )}-` +
            `${pad2(
                now.getDate()
            )}`;

        const gregDateEl =
            document.getElementById(
                "gregorianDate"
            );

        if (gregDateEl) {

            gregDateEl.innerHTML =

                `${isoDate}

                <br>

                <span class="muted">
                ${now.toLocaleTimeString()}
                </span>`;
        }

        const gregMetaEl =
            document.getElementById(
                "gregorianMeta"
            );

        if (gregMetaEl) {

            const month =
                now.toLocaleString(
                    "en-GB",
                    {
                        month:
                            "long"
                    }
                );

            const weekday =
                now.toLocaleString(
                    "en-GB",
                    {
                        weekday:
                            "long"
                    }
                );

            gregMetaEl.textContent =

                `${month}
                •
                ${weekday}`;
        }

        /* ---------------------------- */
        /* Year Progress               */
        /* ---------------------------- */

        const yearLength =
            isLeapYear(
                now.getFullYear()
            )
                ? 366
                : 365;

        const progress =

            (
                (
                    pos.ordinal - 1
                )
                +
                dt.frac
            )
            /
            yearLength;

        const percent =
            floor1(
                progress * 100
            );

        const fill =
            document.getElementById(
                "yearProgressFill"
            );

        if (fill) {

            fill.style.width =
                percent + "%";
        }

        const text =
            document.getElementById(
                "yearProgressText"
            );

        if (text) {

            text.textContent =
                percent.toFixed(1)
                +
                "% year complete";
        }
    }

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            updateYearCard();

            setInterval(
                updateYearCard,
                1000
            );
        }
    );

})();