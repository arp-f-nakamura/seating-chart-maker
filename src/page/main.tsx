import { ReactNode, useEffect, useState } from "react";
import { Input } from "../component/Input";
import { SeatingChart } from "../component/SeatingChart";
import classes from "./css_modules/main.module.css";

export const MainPage = () => {
  /** 座席表設定の開閉 */
  const [isSettingOpen, setIsSettingOpen] = useState(true);
  /** 入力欄の状態 */
  const [tableCountInput, setTableCountInput] = useState(0);
  /** 卓名リスト */
  const [tables, setTables] = useState<string[]>([]);
  /** 各卓の席数 */
  const [tableSeatCounts, setTableSeatCounts] = useState<
    Record<string, number>
  >({});
  /** 座席表 */
  const [seats, setSeats] = useState<Record<string, string[]>>({});
  /** 名簿 */
  const [userName, setUserName] = useState("");

  /** 座席設定開閉ボタン押下時のロジック */
  const onClickSettingDisplay = () => {
    const newSettingFlag = !isSettingOpen;
    setIsSettingOpen(newSettingFlag);
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
    // すでに1席以上登録されている場合に警告
    const alreadyCreated = Object.values(seats).some(
      (seatList) => seatList.length > 0
    );

    if (alreadyCreated) {
      const proceed = window.confirm(
        "現在の座席表はリセットされます。\n上書きしてもよろしいですか？"
      );
      if (!proceed) return;
    }

    const newSeats: Record<string, string[]> = {};
    tables.forEach((tableName) => {
      const count = tableSeatCounts[tableName] ?? 0;
      const old = seats[tableName] ?? [];
      newSeats[tableName] = Array.from(
        { length: count },
        (_, i) => old[i] || ""
      );
    });
    setSeats(newSeats);
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

  // ページ離脱時に確認
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const alreadyCreated = Object.values(seats).some(
        (seatList) => seatList.length > 0
      );

      if (alreadyCreated) {
        e.preventDefault();
        // 非推奨プロパティだが、仕様として必要なため明示的に型アサーション
        (e as any).returnValue =
          "作成済みの座席表があります。ページを離れますか？";
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
      <div style={{ display: isSettingOpen ? "block" : "none" }}>
        <Input
          title="卓数"
          value={!isNaN(tableCountInput) ? tableCountInput : ""}
          onChange={(e) => handleTableCountChange(Number(e.target.value))}
          buttonDetail={{
            title: "座席表作成！",
            onClick: onClickCleateSeats,
          }}
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
      <button onClick={onClickSettingDisplay} className={classes.margin}>
        {isSettingOpen ? "🔼閉じる" : "🔽開く"}
      </button>
      <div className={`${classes.SeatingChartDiv} ${classes.margin}`}>
        {Object.entries(seats).map(([name, names]) => (
          <SeatingChart
            key={name}
            name={name}
            seatCounts={names.length}
            names={names}
          />
        ))}
      </div>
      <Input
        title={`名前`}
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        buttonDetail={{ title: "座席をきめる！", onClick: onClickChooseSeat }}
      />
    </>
  );
};
