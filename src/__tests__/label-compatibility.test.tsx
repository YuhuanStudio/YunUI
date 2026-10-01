import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Pagination } from "../primitives/pagination";
import { ChatComposer } from "../chat/chat-composer";
import { SessionItem } from "../patterns/session-item";
import { NotificationPanel } from "../patterns/notification";

describe("0.2.17 label compatibility", () => {
  it("retains pagination labels and gives the grouped prop precedence", () => {
    render(<Pagination page={2} totalPages={3} onPageChange={() => {}} previousLabel="上一頁" nextLabel="Next legacy" labels={{ next: "下一頁" }} />);
    expect(screen.getByRole("button", { name: "上一頁" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "下一頁" })).toBeEnabled();
    expect(screen.getByRole("navigation")).not.toHaveAttribute("previousLabel");
  });
  it("retains the composer send and stop labels", () => {
    const { rerender } = render(<ChatComposer value="Hello" onChange={() => {}} onSend={() => {}} sendLabel="傳送" />);
    expect(screen.getByRole("button", { name: "傳送" })).toBeEnabled();
    rerender(<ChatComposer value="Hello" onChange={() => {}} onSend={() => {}} loading stopLabel="停止" />);
    expect(screen.getByRole("button", { name: "停止" })).toBeInTheDocument();
  });
  it("retains session badges, running announcement and revoke label", () => {
    const { rerender } = render(<SessionItem name="Desktop" current running currentLabel="目前" runningLabel="執行中" labels={{ current: "目前裝置" }} />);
    expect(screen.getByText("目前裝置")).toBeInTheDocument();
    expect(screen.getByText("執行中")).toHaveClass("sr-only");
    rerender(<SessionItem name="Desktop" inactive inactiveLabel="未啟用" onRevoke={() => {}} revokeLabel="撤銷" />);
    expect(screen.getByText("未啟用")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "撤銷" })).toBeInTheDocument();
  });
  it("retains notification unread, loading and empty strings", () => {
    const { rerender } = render(<NotificationPanel title="通知" unreadCount={2} unreadLabel="未讀" loading loadingLabel="載入中" />);
    expect(screen.getByText(/未讀/)).toBeInTheDocument();
    expect(screen.getByText("載入中")).toBeInTheDocument();
    rerender(<NotificationPanel title="通知" empty emptyLabel="沒有通知" labels={{ empty: "已清空" }} />);
    expect(screen.getByText("已清空")).toBeInTheDocument();
  });
});
