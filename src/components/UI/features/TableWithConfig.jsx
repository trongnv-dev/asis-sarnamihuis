import React, { useEffect, useState } from 'react';
import { commonApi } from 'services';

const data_sample = {
  column_config: {
    // column_id: true,
    column_action: true,
  },
  page: 1,
  per_page: 10,
};

const TableWithConfig = (props) => {
  const { CodeTable, PageView } = props;
  const [userConfig, setUserConfig] = useState(null);

  useEffect(() => {
    async function getUserConfig() {
      try {
        let response = await commonApi.userConfig({ CodeTable: CodeTable });
        if (response.status === 200) {
          const config = JSON.parse(response.data.data.value);

          if (config == null || config.column_config == null || config.page == null || config.per_page == null) {
            await commonApi.colTableConfig({
              code: CodeTable,
              value: data_sample,
            });

            setUserConfig(data_sample);
          } else {
            setUserConfig(JSON.parse(response.data.data.value));
          }
        }
      } catch (e) {
        console.log(e.message);
      }
    }
    getUserConfig();
  }, []);
  return <div>{userConfig && <PageView userConfig={userConfig} />}</div>;
};

export default TableWithConfig;
