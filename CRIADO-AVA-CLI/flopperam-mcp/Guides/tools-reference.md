# UnrealMCP - Tools Reference

**Total commands:** 86
**Generated:** 2026-07-18 from get_command_schema

> Auto-generated. Regenerate with: query get_command_schema.

## Bridge Commands

| Command | Description |
|---|---|
| ping | Health check / pong |
| health | Server info: plugin version, protocol, UE, state, command count |
| get_server_info | Alias for health |
| get_command_schema | List all available commands |
| list_commands | Alias for get_command_schema |
| create_test_report | Session snapshot: commands executed, uptime, version |

## Editor Commands

| Command | Description |
|---|---|
| get_actors_in_level | List all actors in the current level |
| find_actors_by_name | Find actors by name pattern |
| spawn_actor | Spawn a basic actor (StaticMeshActor, PointLight, etc.) |
| delete_actor | Delete an actor by name |
| set_actor_transform | Set actor location/rotation/scale |
| spawn_blueprint_actor | Spawn an actor from a Blueprint |
| attach_actor_to_socket | Attach an actor to a socket of another actor |
| search_assets | Search assets by path, query, and class filters |
| get_asset_details | Get detailed info about an asset |
| list_assets_in_path | List all assets in a content path |
| get_project_info | Project diagnostics: maps, plugins, input, engine version |
| add_widget_to_viewport | Instantiate and add a Widget Blueprint to viewport |
| validate_project | Project diagnostics: maps, plugins, actors, module state |
| compile_project_target | Compile project target (informational - use VS/UBT externally) |
| run_map_check | Run Map Check on current level (severity, message) |
| pie_start | Start Play In Editor session |
| pie_stop | Stop Play In Editor session |
| pie_state | Check PIE state: stopped, queued, running |

## Blueprint Commands

| Command | Description |
|---|---|
| create_blueprint | Create a new Blueprint |
| add_component_to_blueprint | Add a component to a Blueprint SCS |
| remove_component_from_blueprint | Remove a component from a Blueprint SCS |
| attach_component_to_blueprint | Re-parent a component to another in Blueprint SCS |
| set_component_properties | Set component visibility, active, transform, light props |
| get_blueprint_components | List all components in a Blueprint with transforms |
| set_physics_properties | Set physics properties on a Blueprint component |
| compile_blueprint | Compile a Blueprint |
| set_static_mesh_properties | Set static mesh and material on a component |
| set_component_static_mesh | Assign a StaticMesh to a component |
| set_point_light_properties | Set light properties on a PointLightComponent |
| set_mesh_material_color | Set material color on a mesh component |
| get_available_materials | Search for materials in the project |
| apply_material_to_actor | Apply a material to an actor's mesh |
| apply_material_to_blueprint | Apply a material to a Blueprint component |
| get_actor_material_info | Get material info for an actor |
| get_blueprint_material_info | Get material info for a Blueprint component |
| create_material_instance | Create a MaterialInstanceConstant from a parent material |
| set_material_instance_parameter | Set scalar/vector/texture params on a MaterialInstance |
| apply_material_to_component | Apply material to component slot with previous material info |
| get_component_materials | List all materials on a component |
| get_static_mesh_material_slots | List material slots on a StaticMesh |
| read_blueprint_content | Read Blueprint content (graph, variables, components) |
| analyze_blueprint_graph | Deep analysis of a Blueprint graph |
| get_blueprint_variable_details | Get variable details for a Blueprint |
| get_blueprint_function_details | Get function details for a Blueprint |
| get_blueprint_summary | Summary: parent class, components, variables, interfaces, graphs, compilation |
| get_blueprint_diagnostics | Diagnostics: errors, warnings, orphan nodes, loose pins |
| create_input_action_asset | Create an InputAction asset (Enhanced Input) |
| map_input_action | Map an InputAction to an InputMappingContext |
| set_blueprint_property | Set BP-level properties: parent_class, tick_enabled, auto_possess_player/ai |
| set_blueprint_default_value | Set default value on a Blueprint variable |
| create_widget_blueprint | Create a UMG Widget Blueprint (UserWidget) |
| set_component_collision | Set collision: enabled, profile, object_type, generate_overlap_events |
| add_socket_to_component | Add a socket to a StaticMesh or SkeletalMesh component |

## Graph Commands

| Command | Description |
|---|---|
| add_blueprint_node | Add a node to a Blueprint graph |
| connect_nodes | Connect two graph node pins |
| create_variable | Create a new Blueprint variable |
| set_blueprint_variable_properties | Set properties on a Blueprint variable |
| add_event_node | Add an event node to the EventGraph |
| add_input_action_node | Add an InputAction node (enhanced input) |
| add_key_event_node | Add a keyboard key event node |
| delete_node | Delete a node from a Blueprint graph |
| set_node_property | Set property on a graph node |
| create_function | Create a new Blueprint function |
| add_function_input | Add an input parameter to a function |
| add_function_output | Add an output parameter to a function |
| delete_function | Delete a Blueprint function |
| rename_function | Rename a Blueprint function |
| add_get_node | Add a variable Get node |
| call_function_on_object | Add a function call node on a target object |
| add_blueprint_interface | Add an interface to a Blueprint |
| remove_blueprint_interface | Remove an interface from a Blueprint |
| get_blueprint_graph_nodes | Get all nodes in a Blueprint graph with IDs and pins |
| disconnect_pins | Disconnect pins on a node with dry_run support |
| delete_blueprint_node | Delete a node by ID with dry_run, reports broken connections |
| add_enhanced_input_action_node | Add EnhancedInputAction node (asset-ref, not legacy) |
| add_is_valid_guard | Create a GetVariable→IsValid guard pattern |

## Building Commands

| Command | Description |
|---|---|
| create_wall | Procedurally build a wall |
| create_staircase | Procedurally build a staircase |
| create_tower | Procedurally build a tower |
| construct_house | Procedurally build a house |
