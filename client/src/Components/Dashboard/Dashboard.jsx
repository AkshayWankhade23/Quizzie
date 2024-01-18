import style from "./Style.module.css";

const Dashboard = () => {
  return (
    <div className={style.container}>
      <div className={style.cards}>
        <div className={style.quiz_created}>12 Quiz Created </div>
        <div className={style.questions_created}>110 questions Created </div>
        <div className={style.total_impressions}>1.4K Total Impressions</div>
      </div>
      <div>
      Trending Quizs
      </div>
    </div>
  );
};

export default Dashboard;
