#!/usr/bin/env python
"""
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

"""

from resource_management import *
import socket
import sys
from hcat_service_check import hcat_service_check
from webhcat_service_check import webhcat_service_check
from ambari_commons import OSConst
from ambari_commons.os_family_impl import OsFamilyImpl


class HiveServiceCheck(Script):
  pass


@OsFamilyImpl(os_family=OSConst.WINSRV_FAMILY)
class HiveServiceCheckWindows(HiveServiceCheck):
  def service_check(self, env):
    import params
    env.set_params(params)
    smoke_cmd = os.path.join(params.hdp_root,"Run-SmokeTests.cmd")
    service = "HIVE"
    Execute(format("cmd /C {smoke_cmd} {service}"), user=params.hive_user, logoutput=True)

    hcat_service_check()
    webhcat_service_check()


@OsFamilyImpl(os_family=OsFamilyImpl.DEFAULT)
class HiveServiceCheckDefault(HiveServiceCheck):
  def service_check(self, env):
    import params
    env.set_params(params)

    address_list = params.hive_server_hosts
    port = int(format("{hive_server_port}"))
    print "Test connectivity to hive server"
    if params.security_enabled:
      kinitcmd=format("{kinit_path_local} -kt {smoke_user_keytab} {smokeuser_principal}; ")
    else:
      kinitcmd=None

    workable_server_available = False
    for address in address_list:
      try:
        check_thrift_port_sasl(address, port, params.hive_server2_authentication,
                               params.hive_server_principal, kinitcmd, params.smokeuser,
                               transport_mode=params.hive_transport_mode)
        print "Successfully connected to %s on port %s" % (address, port)
        workable_server_available = True
      except:
        print "Connection to %s on port %s failed" % (address, port)

    if not workable_server_available:
      exit(1)

    hcat_service_check()
    webhcat_service_check()

if __name__ == "__main__":
  HiveServiceCheck().execute()
