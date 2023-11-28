import React from 'react';
import styles from '../css/403Page.module.css';

const ForbiddenPage = () => {
  return (
    <html lang="en">
      <body>
        {/* Partial content */}
        <div className={styles.cage}></div>
        <forbiddenH1 className={styles.forbiddenH1}>
          <forbiddenSpan className={styles.forbiddenSpan}>403</forbiddenSpan>
        </forbiddenH1>
        {/* End of partial content */}
      </body>
    </html>
  );
};

export default ForbiddenPage;
