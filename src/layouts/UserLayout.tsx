import { DefaultFooter, MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, SelectLang, useIntl, ConnectProps, connect } from 'umi';
import React from 'react';
import { ConnectState } from '@/models/connect';
import logo from '../assets/evubon-logo.png';
import styles from './UserLayout.less';

export interface UserLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>
          {/* <SelectLang /> */}
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                {/* <span className={styles.title}>Ant Design</span> */}
              </Link>
            </div>
            <div className={styles.desc}>
              {/* Admin Login */}
            </div>
          </div>
          {children}
        </div>
        <DefaultFooter
          copyright={`${new Date().getFullYear()} Ebhubon`}
          links={[]}
          // {[
          //   {
          //     key: 'Ant Design Pro',
          //     title: 'Ant Design Pro',
          //     href: 'https://pro.ant.design',
          //     blankTarget: true,
          //   },
          //   {
          //     key: 'github',
          //     title: <GithubOutlined />,
          //     href: 'https://github.com/ant-design/ant-design-pro',
          //     blankTarget: true,
          //   },
          //   {
          //     key: 'Ant Design',
          //     title: 'Ant Design',
          //     href: 'https://ant.design',
          //     blankTarget: true,
          //   },
          // ]}
        />
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
