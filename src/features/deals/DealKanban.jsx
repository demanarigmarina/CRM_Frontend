import BaseKanban from "../../components/kanban/BaseKanban";
import KanbanColumnHeader from "../../components/kanban/KanbanColumnHeader";
import DealCard from "./DealCard";
import LoaderCards from "../../components/loader/CardsLazyLoader";

const formatTotal = (deals) => {
  const totals = deals.reduce((acc, d) => {
    const currency = d.currency || "PHP";
    acc[currency] = (acc[currency] || 0) + (d.value || 0);
    return acc;
  }, {});
  const SYMBOLS = { PHP: "₱", USD: "$", EUR: "€" };
  return Object.entries(totals)
    .map(
      ([currency, amount]) =>
        `${SYMBOLS[currency] || currency}${amount.toLocaleString()}`,
    )
    .join(" · ");
};

export default function DealKanban({
  columns,
  stages,
  permissions,
  onDragEnd,
  onAddDeal,
  onCardClick,
  isLoading = false,
}) {
  if (isLoading) {
    return <LoaderCards columns={stages} />;
  }

  return (
    <BaseKanban
      columns={columns}
      statuses={stages}
      onDragEnd={onDragEnd}
      emptyMessage="No deals"
      renderHeader={(stage, deals) => (
        <KanbanColumnHeader
          label={stage}
          count={deals.length}
          successStatus="Won"
          subtext={formatTotal(deals)}
          onAdd={permissions?.canCreate ? () => onAddDeal(stage) : null}
          addLabel={`Add deal to ${stage}`}
        />
      )}
      renderCard={(deal, index, deals) => (
        <DealCard
          key={deal._id}
          deal={deal}
          index={index}
          isLast={index === deals.length - 1}
          onClick={() => onCardClick(deal)}
        />
      )}
      successStatus="Won"
    />
  );
}
