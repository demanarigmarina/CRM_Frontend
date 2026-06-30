import TaskCard from "./TaskCard";
import BaseKanban from "../../components/kanban/BaseKanban";
import KanbanColumnHeader from "../../components/kanban/KanbanColumnHeader";
import LoaderCards from "../../components/loader/CardsLazyLoader";

export default function TaskKanban({
  columns,
  statuses,
  permissions,
  onDragEnd,
  onAddTask,
  onCardClick,
  isLoading = false,
}) {
  if (isLoading) {
    return <LoaderCards columns={statuses} />;
  }

  return (
    <BaseKanban
      columns={columns}
      statuses={statuses}
      onDragEnd={onDragEnd}
      emptyMessage="No tasks"
      renderHeader={(status, tasks) => (
        <KanbanColumnHeader
          label={status}
          count={tasks.length}
          successStatus="Completed"
          onAdd={permissions.canCreate ? () => onAddTask(status) : null}
          addLabel={`Add task to ${status}`}
        />
      )}
      renderCard={(task, index, tasks) => (
        <TaskCard
          key={task._id}
          task={task}
          index={index}
          isLast={index === tasks.length - 1}
          onClick={() => onCardClick(task)}
        />
      )}
      successStatus="Completed"
    />
  );
}
