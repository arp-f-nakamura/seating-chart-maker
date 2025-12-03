import { ReactNode, useEffect, useState } from "react";
import { Input } from "../component/Input";
import { SeatingChart } from "../component/SeatingChart";
import classes from "./css_modules/main.module.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ImportPdfButton } from "../component/importPdfButton";

export const MainPage = () => {
  /** イベント名 */
  const [eventName, setEventName] = useState("");
  /** 入力欄の状態 */
  const [tableCountInput, setTableCountInput] = useState(0);
  /** 卓名リスト */
  const [tables, setTables] = useState<string[]>([]);
  /** 各卓の席数 */
  const [tableSeatCounts, setTableSeatCounts] = useState<
    Record<string, number>
  >({});
  /** 座席表ボタン */
  const [creatButtonName, setCreateButtonName] = useState(" 座席表作成！");
  /** 名前ボタンの表示フラグ */
  const [chooseSeatFlg, setChooseSeatFlg] = useState<boolean>(false);
  /** 座席表 */
  const [seats, setSeats] = useState<Record<string, string[]>>({});
  /** 名簿 */
  const [userName, setUserName] = useState("");

  /** イベント名変更時のロジック */
  const handleEventNameChange = (value: string) => {
    setEventName(value);
  };
  /** 卓数変更時のロジック */
  const handleTableCountChange = (value: number) => {
    setTableCountInput(value);
    const newTables = Array.from({ length: value }, (_, i) =>
      String.fromCharCode(65 + i)
    );
    setTables(newTables);
    // 各卓の席数を4に設定
    const newTableSeatCounts: Record<string, number> = {};
    const newSeats: Record<string, string[]> = {};

    newTables.forEach((name) => {
      newTableSeatCounts[name] = 4;
      newSeats[name] = Array(4).fill("");
    });

    setTableSeatCounts(newTableSeatCounts);
  };

  /** 座席表作成！ボタン押下時のロジック */
  const onClickCleateSeats = () => {
    const newSeats: Record<string, string[]> = {};
    tables.forEach((tableName) => {
      const count = tableSeatCounts[tableName] ?? 0;
      const old = seats[tableName] ?? [];
      newSeats[tableName] = Array.from(
        { length: count },
        (_, i) => old[i] || ""
      );
    });
    const newFlg: boolean = chooseSeatFlg ? false : true;
    setSeats(newSeats);
    setChooseSeatFlg(newFlg);
    setCreateButtonName(chooseSeatFlg ? "座席表作成！" : "座席表編集");
  };

  /** 各卓の席数変更時のロジック */
  const handleSeatCountChange = (name: string, value: string) => {
    const count = Number(value);
    if (isNaN(count) || count < 0) return;

    setTableSeatCounts((prev) => ({
      ...prev,
      [name]: count,
    }));
  };

  /** 座席をきめるボタン押下時のロジック */
  const onClickChooseSeat = () => {
    if (!userName.trim()) return;

    // 空席一覧を作成：[["A", 0], ["A", 1], ...]
    const emptySeats: [string, number][] = [];
    Object.entries(seats).forEach(([table, seatList]) => {
      seatList.forEach((name, index) => {
        if (!name) emptySeats.push([table, index]);
      });
    });

    if (emptySeats.length === 0) {
      alert("空いている席がありません！");
      return;
    }

    // ランダムに1つ選ぶ
    const [targetTable, targetIndex] =
      emptySeats[Math.floor(Math.random() * emptySeats.length)];

    // 新しい seats を作って更新
    setSeats((prev) => ({
      ...prev,
      [targetTable]: prev[targetTable].map((n, i) =>
        i === targetIndex ? userName : n
      ),
    }));

    // 入力欄クリア
    setUserName("");
  };

  // PDF化
  const onClickDownloadForPDF = (elementId: string, id: string) => () => {
    const input = document.getElementById(elementId);
    if (input) {
      html2canvas(input, { scale: 2.5 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/svg", 1.0); // 一度svgにする。pngでもjpegでもok
        let pdf = new jsPDF(); // pdfを生成
        pdf.addImage(
          imgData,
          "SVG",
          5,
          10,
          canvas.width / 18,
          canvas.height / 18
        );
        pdf.save(`${id}.pdf`);
      });
    }
  };

  // ページ離脱時に確認
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const alreadyCreated = Object.values(seats).some(
        (seatList) => seatList.length > 0
      );

      if (alreadyCreated) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [seats]);

  return (
    <>
      <h2 className={classes.margin}>座席表メーカー</h2>
      {!chooseSeatFlg && (
        <div className={classes.tableEditComponent}>
          <Input
            title="イベント名"
            value={eventName}
            onChange={(e) => handleEventNameChange(e.target.value)}
          />
          <Input
            title="卓数"
            value={!isNaN(tableCountInput) ? tableCountInput : ""}
            onChange={(e) => handleTableCountChange(Number(e.target.value))}
          />
          <div className={`${classes.tableCountDiv} ${classes.margin}`}>
            {tables.map((name) => (
              <div key={name}>
                <Input
                  title={`${name}卓`}
                  value={tableSeatCounts[name]}
                  onChange={(e) => handleSeatCountChange(name, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <button className={classes.margin} onClick={onClickCleateSeats}  disabled={tableCountInput === 0}>
        {creatButtonName}
      </button>
      <ImportPdfButton
        elementId="sheet"
        onClick={onClickDownloadForPDF("sheet", `${eventName}座席表`)}
        isAbled={Object.keys(seats).length > 0}
      >
        {Object.keys(seats).length > 0 && eventName && (
          <h3 className={classes.margin}>{eventName}の座席表</h3>
        )}
        <div className={`${classes.SeatingChartDiv} ${classes.margin}`}>
          {Object.entries(seats).map(([name, names]) => (
            <SeatingChart
              key={name}
              name={name}
              seatCounts={names.length}
              names={names}
              onChangeSeatName={(seatIndex, newName) => {
                setSeats((prev) => ({
                  ...prev,
                  [name]: prev[name].map((n, i) =>
                    i === seatIndex ? newName : n
                  ),
                }));
              }}
              onDeleteSeatName={(seatIndex) => {
                setSeats((prev) => ({
                  ...prev,
                  [name]: prev[name].map((n, i) => (i === seatIndex ? "" : n)),
                }));
              }}
            />
          ))}
        </div>
        {Object.keys(seats).length > 0 && (
          <Input
            title={`名前`}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            buttonDetail={{
              title: "座席をきめる！",
              onClick: onClickChooseSeat,
            }}
          />
        )}
      </ImportPdfButton>
    </>
  );
};
