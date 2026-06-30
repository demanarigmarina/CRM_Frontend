import { FiCalendar } from "react-icons/fi";

import BaseDraggableCard from "../../components/kanban/BaseDraggableCard";
import BaseBadge from "../../components/badge/BaseBadge";
import UserDisplayName from "../../components/UserDisplayName";

import { getProfileImage } from "../../utils/avatar";
import { getDisplayName } from "../../utils/name";
import { formatCurrencyCompact } from "../../utils/currency";
import { formatDate } from "../../utils/date";
import { getProbabilityTone } from "../deals/utils/dealPresentation";

export default function DealCard({ deal, index, isLast, onClick }) {
  const customerName = deal.customer
    ? getDisplayName(deal.customer, { includeSuffix: true })
    : "—";

  const assignedName = deal.assignedTo ? (
    <UserDisplayName user={deal.assignedTo} showIcon={false}>
      {getDisplayName(deal.assignedTo, { includeSuffix: true })}
    </UserDisplayName>
  ) : (
    "Unassigned"
  );

  const expectedClose = deal.expectedCloseDate
    ? formatDate(deal.expectedCloseDate)
    : null;

  return (
    <BaseDraggableCard
      id={deal._id}
      index={index}
      isLast={isLast}
      onClick={() => onClick(deal)}
    >
      {/* Title + Probability */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-gray-500 leading-tight line-clamp-2">
          {deal.title}
        </h4>
        <BaseBadge
          tone={getProbabilityTone(deal.probability).tone}
          size="xs"
          shape="pill"
          title={`${deal.probability}% probability`}
        >
          {deal.probability}%
        </BaseBadge>
      </div>

      {/* Value */}
      <div className="flex items-center gap-1.5 text-lg font-bold text-gray-600 mb-2.5">
        {formatCurrencyCompact(deal.value, deal.currency)}
      </div>

      {/* Customer */}
      <div className="text-xs text-gray-500 mb-1.5 truncate">
        <span className="font-medium text-gray-600">{customerName} · </span>
        {deal.customer?.company && <span>{deal.customer.company}</span>}
      </div>

      {/* Footer: Assigned user + Expected close */}
      <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2 pt-2 border-t border-gray-100">
        <span className="flex items-center gap-1 truncate">
          <img
            src={getProfileImage(deal.assignedTo)}
            alt="assignee avatar"
            className="w-5 h-5 rounded-full border"
          />
          {assignedName}
        </span>
        {expectedClose && (
          <span className="flex items-center gap-1 whitespace-nowrap">
            <FiCalendar size={11} />
            {expectedClose}
          </span>
        )}
      </div>
    </BaseDraggableCard>
  );
}
